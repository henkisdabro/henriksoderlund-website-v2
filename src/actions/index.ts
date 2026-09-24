import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro/zod';
import { env } from 'cloudflare:workers';
import { CONTACT_SYNTHETIC_TOKEN, TURNSTILE_SECRET_KEY } from 'astro:env/server';
import { CONTACT_EMAIL } from '../data/links';

// The apex is onboarded to Cloudflare Email Service alongside Google Workspace.
// Must match allowed_sender_addresses in wrangler.json.
const SENDER = 'noreply@henriksoderlund.com';

// Where a synthetic check (tests/e2e/production.spec.ts) sends instead of
// CONTACT_EMAIL. A Gmail filter archives this alias, and a leaked token can
// reach nothing else. Must match allowed_destination_addresses in wrangler.json.
const SYNTHETIC_RECIPIENT = 'admin+synthetic@henriksoderlund.com';

// Control characters (including CR/LF) in the name would land in the email
// subject header. The browser input strips them; a raw POST does not.
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\x00-\x1f\x7f]/;

export const server = {
  contact: defineAction({
    accept: 'form',
    input: z.object({
      name: z
        .string()
        .min(1, 'Name is required')
        .max(100, 'Name must be 100 characters or fewer')
        .refine(
          (value) => !CONTROL_CHARS.test(value),
          'Name must not contain line breaks or control characters'
        ),
      email: z
        .email({ error: 'Please enter a valid email address' })
        .max(200, 'Email must be 200 characters or fewer'),
      message: z
        .string()
        .min(10, 'Message must be at least 10 characters')
        .max(2000, 'Message must be 2000 characters or fewer'),
      'cf-turnstile-response': z
        .string()
        .min(1, 'Please complete the verification'),
    }),
    handler: async (input, context) => {
      if (!TURNSTILE_SECRET_KEY) {
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Server configuration error',
        });
      }

      // CI and a daily schedule submit with this header to prove every hop a
      // real lead takes, short of a human solving Turnstile.
      const synthetic =
        Boolean(CONTACT_SYNTHETIC_TOKEN) &&
        context.request.headers.get('X-Synthetic-Check') === CONTACT_SYNTHETIC_TOKEN;

      const ip = context.request.headers.get('CF-Connecting-IP') ?? '';

      // Fail closed, deliberately: a non-2xx response, a body that is not JSON
      // (Turnstile 5xx pages are HTML), or a body without `success: true` all
      // count as a failed verification rather than a server error.
      let verification: { success?: unknown; 'error-codes'?: unknown } | null = null;
      try {
        const verifyRes = await fetch(
          'https://challenges.cloudflare.com/turnstile/v0/siteverify',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              secret: TURNSTILE_SECRET_KEY,
              response: input['cf-turnstile-response'],
              remoteip: ip,
            }),
          }
        );
        verification = verifyRes.ok ? await verifyRes.json() : null;
      } catch (cause) {
        // Logged so a Cloudflare-side outage is distinguishable from a bot:
        // both fail closed, but only one of them is ours to fix.
        console.error('[contact] Turnstile siteverify request failed', cause);
      }

      // A synthetic check has no real token, so siteverify always rejects it.
      // It rejects the token alone (`invalid-input-response`) only when the
      // secret is valid - a bad secret is `invalid-input-secret` - so that
      // exact rejection is what proves the secret still works.
      const errorCodes = verification?.['error-codes'];
      const verified = synthetic
        ? Array.isArray(errorCodes) &&
          errorCodes.length === 1 &&
          errorCodes[0] === 'invalid-input-response'
        : verification?.success === true;

      if (!verified) {
        throw new ActionError({
          code: 'FORBIDDEN',
          message: 'Verification failed',
        });
      }

      try {
        await env.EMAIL.send({
          from: { email: SENDER, name: 'Henrik Soderlund' },
          to: synthetic ? SYNTHETIC_RECIPIENT : CONTACT_EMAIL,
          replyTo: input.email,
          subject: `Website contact from ${input.name}`,
          text: `From: ${input.name} (${input.email})\n\n${input.message}`,
        });
      } catch (cause) {
        console.error('[contact] Email Service send failed', cause);
        // The Email Service code (E_SENDER_NOT_VERIFIED and so on) rides along
        // into the form_error analytics event, so GA4 shows which hop broke.
        const code = (cause as { code?: unknown } | null)?.code;
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: typeof code === 'string' ? `Failed to send email (${code})` : 'Failed to send email',
        });
      }

      return { success: true };
    },
  }),
};
