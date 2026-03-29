import type { APIRoute } from 'astro';
import { markdownResponse } from '../utils/markdownResponse';
import { getHomeMarkdown } from '../utils/pageMarkdown';

export const prerender = true;

export const GET: APIRoute = () => markdownResponse(getHomeMarkdown());
