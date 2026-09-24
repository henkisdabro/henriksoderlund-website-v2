// Reads back what the local Email Service simulator "sent". wrangler prints
// each send_email call and writes its body to a file; serve-worker.mjs tees
// that output to test-results/wrangler-<port>.log.

import { readFileSync } from 'node:fs';
import { expect } from '@playwright/test';

export type SentEmail = { from: string; to: string; subject: string; text: string };

const SEND = /send_email binding called with MessageBuilder:\nFrom: (.*)\nTo: (.*)\nSubject: (.*)\n\nText: (\S+)/g;

/** Starts watching a local instance's log; only sends after this call count. */
export function watchEmails(port: number) {
  const path = `test-results/wrangler-${port}.log`;
  const offset = readFileSync(path, 'utf-8').length;

  const sent = (): SentEmail[] =>
    [...readFileSync(path, 'utf-8').slice(offset).matchAll(SEND)].map((m) => ({
      from: m[1],
      to: m[2],
      subject: m[3],
      text: readFileSync(m[4], 'utf-8'),
    }));

  return {
    sent,
    async one(): Promise<SentEmail> {
      await expect.poll(() => sent().length, { message: 'no email was sent' }).toBeGreaterThan(0);
      const all = sent();
      expect(all, 'more than one email was sent').toHaveLength(1);
      return all[0];
    },
  };
}
