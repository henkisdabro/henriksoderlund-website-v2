import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro/zod';
import { Resend } from 'resend';
import { RESEND_API_KEY, TURNSTILE_SECRET_KEY } from 'astro:env/server';
import { CONTACT_EMAIL } from '../data/links';

// Control characters (including CR/LF) in the name would land in the email
// subject header. The browser input strips them; a raw POST does not.
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\x00-\x1f\x7f]/;

/**
 * Stable id for one submission: an F5 re-POST of the same enquiry produces the
 * same id, a genuine second enquiry produces a different one. Used client-side
 * to deduplicate the generate_lead event.
 */
async function submissionIdFor(email: string, message: string): Promise<string> {
  const data = new TextEncoder().encode(`${email}|${message}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest).slice(0, 12))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

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
      if (!RESEND_API_KEY || !TURNSTILE_SECRET_KEY) {
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Server configuration error',
        });
      }

      const ip = context.request.headers.get('CF-Connecting-IP') ?? '';

      // Fail closed, deliberately: a non-2xx response, a body that is not JSON
      // (Turnstile 5xx pages are HTML), or a body without `success: true` all
      // count as a failed verification rather than a server error.
      let verified = false;
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
        if (verifyRes.ok) {
          const body: unknown = await verifyRes.json();
          verified =
            typeof body === 'object' &&
            body !== null &&
            (body as { success?: unknown }).success === true;
        }
      } catch {
        verified = false;
      }

      if (!verified) {
        throw new ActionError({
          code: 'FORBIDDEN',
          message: 'Verification failed',
        });
      }

      const resend = new Resend(RESEND_API_KEY);
      let sendFailed = false;
      try {
        const { error } = await resend.emails.send({
          from: 'Henrik Soderlund <noreply@utmhub.co>',
          to: CONTACT_EMAIL,
          replyTo: input.email,
          subject: `Website contact from ${input.name}`,
          text: `From: ${input.name} (${input.email})\n\n${input.message}`,
        });
        sendFailed = Boolean(error);
      } catch {
        // Network failure or a non-JSON response from the Resend API
        sendFailed = true;
      }

      if (sendFailed) {
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to send email',
        });
      }

      return {
        success: true,
        submissionId: await submissionIdFor(input.email, input.message),
      };
    },
  }),
};
