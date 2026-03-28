import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = ({ request }) => {
  const metrics = {
    worker_name: 'henriksoderlund-website-v2',
    timestamp: new Date().toISOString(),
    cf_ray: request.headers.get('cf-ray') ?? 'unknown',
    cf_country: request.headers.get('cf-ipcountry') ?? 'unknown',
    cf_colo: request.headers.get('cf-ipcolo') ?? 'unknown',
    user_agent: (request.headers.get('user-agent') ?? 'unknown').substring(0, 100),
    request_id: crypto.randomUUID(),
  };

  return Response.json(metrics, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    },
  });
};
