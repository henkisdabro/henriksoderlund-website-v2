import type { APIRoute } from 'astro';
import { markdownResponse } from '../utils/markdownResponse';
import { getContactMarkdown } from '../utils/pageMarkdown';

export const prerender = true;

export const GET: APIRoute = () => markdownResponse(getContactMarkdown());
