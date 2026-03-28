import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = () => {
  const securityTxt = `Contact: https://www.henriksoderlund.com/consultancy
Expires: 2027-03-28T00:00:00.000Z
Preferred-Languages: en, sv
Canonical: https://www.henriksoderlund.com/.well-known/security.txt
Policy: https://www.henriksoderlund.com/
`;

  return new Response(securityTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
