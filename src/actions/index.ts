import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro/zod';
import { Resend } from 'resend';
import { RESEND_API_KEY, TURNSTILE_SECRET_KEY } from 'astro:env/server';
import { CONTACT_EMAIL } from '../data/links';

export const server = {
  contact: defineAction({
    accept: 'form',
    input: z.object({
      name: z.string().min(1, 'Name is required').max(100),
      email: z.string().email('Please enter a valid email address').max(200),
      message: z
        .string()
        .min(10, 'Message must be at least 10 characters')
        .max(2000),
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
      const turnstileResult = (await verifyRes.json()) as { success: boolean };
      if (!turnstileResult.success) {
        throw new ActionError({
          code: 'FORBIDDEN',
          message: 'Verification failed',
        });
      }

      const resend = new Resend(RESEND_API_KEY);
      const { error } = await resend.emails.send({
        from: 'Henrik Soderlund <noreply@utmhub.co>',
        to: CONTACT_EMAIL,
        replyTo: input.email,
        subject: `Website contact from ${input.name}`,
        text: `From: ${input.name} (${input.email})\n\n${input.message}`,
      });

      if (error) {
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to send email',
        });
      }

      return { success: true };
    },
  }),
};
