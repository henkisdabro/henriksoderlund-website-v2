import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = () => {
  return Response.json(
    {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'henriksoderlund-website-v2',
      version: '3.0.0',
      uptime: 'available',
    },
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    }
  );
};
