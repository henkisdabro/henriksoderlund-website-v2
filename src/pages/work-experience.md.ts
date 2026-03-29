import type { APIRoute } from 'astro';
import { markdownResponse } from '../utils/markdownResponse';
import { getWorkExperienceMarkdown } from '../utils/pageMarkdown';

export const prerender = true;

export const GET: APIRoute = () => markdownResponse(getWorkExperienceMarkdown());
