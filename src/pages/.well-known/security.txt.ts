import type { APIRoute } from 'astro';

export const prerender = false;

// RFC 9116 section 2.5.5 requires a future `Expires` and recommends less than a
// year out. Six months from the request keeps the file permanently conformant
// without anyone having to remember to bump a literal.
const EXPIRY_MONTHS = 6;

function expiresAt(from: Date): string {
  const expiry = new Date(from);
  expiry.setUTCMonth(expiry.getUTCMonth() + EXPIRY_MONTHS);
  return expiry.toISOString();
}

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
Expires: ${expiresAt(new Date())}
Preferred-Languages: en, sv
Canonical: https://www.henriksoderlund.com/.well-known/security.txt
`;

  return new Response(securityTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
