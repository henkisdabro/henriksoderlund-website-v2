import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = () => {
  const securityTxt = `#
#   +-------------------------------------+
#   |        S E C U R I T Y . T X T      |
#   +-------------------------------------+
#   |                                     |
#   |  Thanks for checking!               |
#   |  Good security hygiene starts       |
#   |  with transparency.                 |
#   |                                     |
#   |  RFC 9116 - https://securitytxt.org |
#   +-------------------------------------+
#

Contact: https://www.henriksoderlund.com/contact
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
