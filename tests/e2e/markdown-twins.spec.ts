import { test, expect } from './fixtures';
import { consultationData } from '../../src/data/consultation';
import { expertiseData } from '../../src/data/expertise';

// The .md twins are each page's plain-text version and feed /llms-full.txt,
// so they must carry what the HTML page shows.

for (const path of ['/consultancy.md', '/llms-full.txt']) {
  test(`${path} carries the consultancy technology stack, quality guarantee and FAQ`, async ({ request }) => {
    const text = await (await request.get(path)).text();
    expect(text).toContain('### Technology Stack\n\n- Asana API for workflow automation');
    expect(text).toContain(`## Quality Guarantee\n\n${consultationData.qualityGuarantee.paragraph}`);
    expect(text).toContain('## Frequently Asked Questions');
    expect(consultationData.faq.items).toHaveLength(6);
    for (const { question, answer } of consultationData.faq.items) {
      expect(text).toContain(`### ${question}\n\n${answer}`);
    }
  });
}

for (const path of ['/expertise.md', '/llms-full.txt']) {
  test(`${path} bolds the skills the expertise page highlights`, async ({ request }) => {
    const text = await (await request.get(path)).text();
    expect(text).toContain('- **GA4**\n');
    expect(text).toContain('- **Claude Code**\n');
    expect(text).toContain('- **Cloudflare Workers**\n');
  });
}

test('/expertise.md leaves every other skill unbolded', async ({ request }) => {
  const lines = (await (await request.get('/expertise.md')).text()).split('\n');
  for (const group of expertiseData.skills.groups) {
    for (const skill of group.skills.filter((s) => !group.core?.includes(s))) {
      expect(lines).toContain(`- ${skill}`);
    }
  }
});
