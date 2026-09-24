// Reads the *published* GTM container and answers "which GA4 tags fire for
// this dataLayer event, and which keys do they forward". The site and the
// container are edited in two different places, so this is the only check
// that the two still agree. It caught a rename (contact_form_submission ->
// generate_lead) that had left GA4 blind to every lead for weeks.

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

export const GTM_ID = 'GTM-KM56HHS2';

// Events the site pushes that deliberately have no GA4 tag. Adding an event to
// the site without either a GTM tag or an entry here fails CI - that is the
// point: a new event is a GTM change too.
export const UNTRACKED_EVENTS: Record<string, string> = {
  dl_init: 'seeds page metadata for other tags; not a measurement in itself',
  theme_toggle: 'UI preference, not reported on',
};

// Custom events the container pushes to itself (from a custom template), so a
// trigger on them is not a sign of a site event gone missing.
export const CONTAINER_OWN_EVENTS: Record<string, string> = {
  coreWebVitals: 'pushed by the Core Web Vitals template inside the container',
};

type Macro = { function: string; vtp_name?: string };
type Tag = {
  function: string;
  vtp_eventName?: unknown;
  vtp_eventSettingsTable?: unknown[];
};
type Predicate = { function: string; arg0: unknown; arg1: unknown; ignore_case?: boolean };
type Rule = [string, ...number[]][];
export type Container = { macros: Macro[]; tags: Tag[]; predicates: Predicate[]; rules: Rule[] };

export async function loadContainer(): Promise<Container> {
  const res = await fetch(`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`);
  if (!res.ok) throw new Error(`gtm.js returned HTTP ${res.status}`);
  const src = await res.text();
  // gtm.js embeds the published container as a JSON literal: `var data = {...\n};`
  const start = src.indexOf('var data = ');
  const end = src.indexOf('\n};', start);
  if (start < 0 || end < 0) throw new Error('gtm.js layout changed: no `var data` block');
  return JSON.parse(src.slice(start + 'var data = '.length, end + 2)).resource;
}

const isMacroRef = (v: unknown): v is ['macro', number] =>
  Array.isArray(v) && v[0] === 'macro' && typeof v[1] === 'number';

function eventPredicates(c: Container): { index: number; matches: (e: string) => boolean; name: string }[] {
  return c.predicates.flatMap((p, index) => {
    if (!isMacroRef(p.arg0) || c.macros[p.arg0[1]]?.function !== '__e') return [];
    const arg = String(p.arg1);
    if (p.function === '_eq') return [{ index, name: arg, matches: (e: string) => e === arg }];
    if (p.function === '_re') {
      const re = new RegExp(arg, p.ignore_case ? 'i' : '');
      return [{ index, name: `/${arg}/`, matches: (e: string) => re.test(e) }];
    }
    return [];
  });
}

/** Event names (or /regex/ patterns) any trigger in the container listens for. */
export function triggerEventNames(c: Container): string[] {
  return eventPredicates(c).map((p) => p.name);
}

/** GA4 event tags that fire on a dataLayer event. Other trigger conditions are ignored. */
export function ga4TagsFor(c: Container, event: string): Tag[] {
  const preds = new Set(eventPredicates(c).filter((p) => p.matches(event)).map((p) => p.index));
  const tags = c.rules.flatMap((rule) => {
    const ifs = rule.find((part) => part[0] === 'if')?.slice(1) ?? [];
    if (!ifs.some((i) => preds.has(i as number))) return [];
    return (rule.find((part) => part[0] === 'add')?.slice(1) ?? []) as number[];
  });
  return [...new Set(tags)].map((i) => c.tags[i]).filter((t) => t.function === '__gaawe');
}

/** dataLayer keys a GA4 tag reads into its event parameters. */
export function forwardedKeys(c: Container, tag: Tag): Set<string> {
  const rows = (tag.vtp_eventSettingsTable ?? []).slice(1) as unknown[][];
  return new Set(
    rows.flatMap((row) => {
      const value = row[row.indexOf('parameterValue') + 1];
      const macro = isMacroRef(value) ? c.macros[value[1]] : undefined;
      return macro?.function === '__v' && macro.vtp_name ? [macro.vtp_name] : [];
    })
  );
}

/**
 * Keys of a pushed event that no GA4 tag forwards. Empty means GA4 receives
 * everything the site measured. Throws if the event reaches no GA4 tag at all.
 */
export function unforwardedKeys(c: Container, pushed: Record<string, unknown>): string[] {
  const event = String(pushed.event);
  const tags = ga4TagsFor(c, event);
  if (tags.length === 0) throw new Error(`no GA4 tag in ${GTM_ID} fires on '${event}'`);
  const forwarded = new Set(tags.flatMap((t) => [...forwardedKeys(c, t)]));
  return Object.keys(pushed).filter(
    (k) => k !== 'event' && !k.startsWith('gtm.') && !forwarded.has(k)
  );
}

/** Every `event: '<name>'` pushed from site source, with the file it comes from. */
export function sourceEvents(root = 'src'): Map<string, string> {
  const found = new Map<string, string>();
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (/\.(astro|ts|js|mjs)$/.test(entry.name)) {
        for (const m of readFileSync(path, 'utf-8').matchAll(/['"]?\bevent['"]?\s*:\s*['"]([\w.]+)['"]/g)) {
          if (!m[1].startsWith('gtm.') && !found.has(m[1])) found.set(m[1], path);
        }
      }
    }
  };
  walk(root);
  return found;
}
