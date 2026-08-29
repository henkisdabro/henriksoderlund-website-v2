import type { APIRoute } from 'astro';
import { version } from '../../package.json';

export const prerender = false;

// Fixed when the module is first evaluated, so it doubles as a coarse
// "which deployment am I talking to" marker alongside the package version.
const BUILD_TIME = new Date().toISOString();

export const GET: APIRoute = () => {
  return Response.json(
    {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'henriksoderlund-website-v2',
      version,
      buildTime: BUILD_TIME,
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
