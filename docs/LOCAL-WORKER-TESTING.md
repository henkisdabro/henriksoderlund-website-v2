# Local Worker testing

`astro dev` never runs `src/worker.ts`, so redirects, security headers, the CSP and the `/sgtm/` proxy cannot be checked there. Testing them locally means running the built bundle under Wrangler, and three separate traps make the obvious approaches fail. Follow this rather than improvising.

## 1. `pnpm run preview` does not work

The script is plain `astro preview`, which `@astrojs/cloudflare` does not support with `output: 'server'`. It exits without binding a port, in some shells without printing an error. Build and run the bundle instead:

```bash
pnpm run build
npx wrangler dev -c dist/server/wrangler.json --port 8801 --local --ip 127.0.0.1
```

## 2. A stale `.wrangler/deploy/config.json` blocks `wrangler dev`

If a previous deploy left this cache behind, Wrangler refuses to start with "Found both a user configuration file ... and a deploy configuration file ... do not share the same base path". The file is gitignored and regenerated on the next deploy, so deleting it is safe:

```bash
rm -f .wrangler/deploy/config.json
```

## 3. `routes` makes `wrangler dev` 301 every single request

`wrangler.json` declares `routes: [{ pattern: "henriksoderlund.com/*", zone_name: "henriksoderlund.com" }]`. Under `wrangler dev` this emulates the Cloudflare zone and canonicalises **every** request - including `/` and static assets - to `https://www.<host><path>` with a bare 301 and no Worker headers at all. It looks exactly like a bug in the Worker's own redirect logic. It is a dev-tooling artifact.

Strip `routes` from the **built** config only. Never edit the source `wrangler.json` for this:

```bash
node -e "const f='dist/server/wrangler.json',w=require('./'+f);delete w.routes;require('fs').writeFileSync(f,JSON.stringify(w))"
```

Restart `wrangler dev` afterwards, and rebuild (or restore the config) when finished.

## Expected results

With `routes` stripped:

- `/` returns 200
- `/skills` returns 301 to `/expertise`
- `/index.xml` returns **410 Gone**, not a redirect - defunct Hugo-era feed paths are in the `GONE` set in `src/worker.ts` deliberately, to avoid Google's soft-404 classification

Redirect `Location` hosts will point at `127.0.0.1:<port>` locally. The naked-domain to-`www` branch in `src/worker.ts` only fires for `hostname === 'henriksoderlund.com'`, so it stays dormant on localhost and resolves to `https://www.henriksoderlund.com` in production.

The authoritative check remains the post-deploy smoke test in `.github/workflows/deploy.yml`, which runs against the deployed site and asserts both status codes and body sizes.
