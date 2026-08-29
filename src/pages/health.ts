import type { APIRoute } from 'astro';
import { version } from '../../package.json';

export const prerender = false;

export const GET: APIRoute = () => {
  return Response.json(
    {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'henriksoderlund-website-v2',
      version,
    },
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
        'X-Robots-Tag': 'noindex',
      },
    }
  );
};
