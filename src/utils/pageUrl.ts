/**
 * One canonical derivation of a page's absolute URL, shared by the `<link
 * rel="canonical">` in `SEO.astro`, the `WebPage` node in `BaseLayout.astro`
 * and the per-page JSON-LD nodes. These values have to byte-match each other:
 * a `#webpage` reference that differs from the `@id` it points at is a dangling
 * JSON-LD edge that nothing in the build catches.
 */

/** Production origin, with no trailing slash. `Astro.site` stringifies with one. */
export const SITE_ORIGIN = 'https://www.henriksoderlund.com';

/**
 * Absolute canonical URL for a route.
 *
 * The site is `trailingSlash: 'never'`, so every off-root URL ends without a
 * slash while the homepage keeps its root slash.
 */
export function pageUrl(pathname: string): string {
  const path = pathname.replace(/\/+$/, '');
  return path === '' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${path}`;
}

/**
 * `@id` for a JSON-LD node hanging off a page, e.g.
 * `nodeId('/consultancy', 'faq')` -> `https://www.henriksoderlund.com/consultancy#faq`.
 */
export function nodeId(pathname: string, fragment: string): string {
  return `${pageUrl(pathname)}#${fragment}`;
}

/**
 * Every `*.md.ts` route under `src/pages` is a plain-text twin of an HTML page.
 * Globbing them keeps the alternate links in step with the filesystem, so a page
 * without a twin can never emit a dead link.
 *
 * This lives in a plain module so the glob, the map and the Set are evaluated
 * once per isolate. Astro frontmatter re-runs on every render, so the same code
 * inside a component would rebuild the Set on each SSR request.
 */
const MARKDOWN_ROUTES = new Set(
  Object.keys(import.meta.glob('/src/pages/**/*.md.ts')).map((file) =>
    file.replace('/src/pages', '').replace(/\.ts$/, '')
  )
);

/** Absolute URL of a page's plain-text twin, or `null` where it has none. */
export function markdownTwinUrl(pathname: string): string | null {
  const path = pathname.replace(/\/+$/, '');
  const candidate = path === '' ? '/index.html.md' : `${path}.md`;
  return MARKDOWN_ROUTES.has(candidate) ? `${SITE_ORIGIN}${candidate}` : null;
}
