import type { APIRoute } from 'astro';
import { markdownResponse } from '../utils/markdownResponse';

export const prerender = true;

export const GET: APIRoute = () => {
  return markdownResponse(`# Education - Henrik Soederlund

## Tertiary Education

1999-2006 - Sweden

Master of Music [M.Mus.] Instrument: Trombone at Lund University

Malmoe, Sweden

## Secondary Education

1996-1999 - Sweden

Natural Sciences at Kattegattgymnasiet

Malmoe, Sweden

## Primary Education

1987-1996 - Sweden

Elementary at Oerjanskolan

Halmstad, Sweden
`);
};
