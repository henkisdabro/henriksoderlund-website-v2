import type { APIRoute } from 'astro';
import { markdownResponse } from '../utils/markdownResponse';

export const prerender = true;

export const GET: APIRoute = () => {
  return markdownResponse(`# Henrik Soederlund - Technology Leader & AI Innovator

Technology Leader & AI Solutions Expert. Accomplished agency founder and enterprise leader specialising in automation, advanced analytics, and high-performance team development.

## Hello

Technology leader with proven expertise in both entrepreneurial and enterprise environments. After founding and scaling the award-winning Creme Digital, led media activations at Initiative Perth (KINESSO, Interpublic Group).

Architected measurement solutions and guided high-performance teams across programmatic and performance marketing channels. Built career on developing sophisticated systems and automation workflows.

Leadership approach centres on developing high-performing teams and cultivating lasting client relationships. Successfully rebuilt teams during challenging transitions, mentored 20+ professionals, and delivered compelling presentations that have secured major partnerships.
`);
};
