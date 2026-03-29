import type { APIRoute } from 'astro';
import { markdownResponse } from '../utils/markdownResponse';
import { getEducationMarkdown } from '../utils/pageMarkdown';

export const prerender = true;

export const GET: APIRoute = () => markdownResponse(getEducationMarkdown());
