import { removeEmojis } from './removeEmojis';

export function markdownResponse(content: string): Response {
  return new Response(removeEmojis(content), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
