# Local Worker testing

`astro dev` never runs `src/worker.ts`, so redirects, security headers, the CSP and the `/sgtm/` proxy cannot be checked there. Testing them locally means running the built bundle under Wrangler, and three separate traps make the obvious approaches fail. A fourth trap takes down `astro dev` itself. Follow this rather than improvising.

## 0. `astro dev` is a background daemon since Astro 7

It detaches immediately and prints only its pid, so a script that starts it and then curls straight away will hit a closed port. It also binds `localhost`, **not** `127.0.0.1` - requests to the IP address get connection-refused even while the server is up.

```bash
astro dev              # starts detached, returns at once
astro dev status       # is it running, on which port
astro dev logs         # the output that used to go to the terminal
astro dev stop         # `pkill -f "astro dev"` does not reliably stop it
```

Wait for readiness before probing, and use the hostname:

```bash
until curl -sf -o /dev/null http://localhost:4321/; do sleep 1; done
```

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

## 4. A stale SSR dep hash makes `astro dev` 500 every route

Symptom: every route on `astro dev` returns 500 with

```
The file does not exist at ".../node_modules/.vite/deps_ssr/astro_actions_runtime_entrypoints_server__js.js?v=<hash>"
which is in the optimize deps directory.
```

It reads like a broken contact form, because Astro Actions are what pull that entrypoint in. It is not: the stack trace is in `matchRoute`, so **routing** is what fails and every page goes down with it.

Vite's SSR dependency optimizer re-bundles `astro/actions/runtime/entrypoints/server.js` under a hashed filename and bumps that hash whenever it rediscovers dependencies. The Cloudflare plugin's `workerd` runner keeps the module graph from before the re-run, so the next request resolves a `?v=<old hash>` file that no longer exists. Adding routes or a new shared import (anything that gives the optimizer more to find) makes it fire.

`rm -rf node_modules/.vite` clears it for one run and it comes back with a different hash. This is now fixed upstream and needs nothing in this repo: `@astrojs/cloudflare` >= 14.2.x pre-includes `astro/actions/runtime/entrypoints/server.js` in `optimizeDeps.include` for the `astro`, `ssr` and `prerender` environments, so the entrypoint is bundled once at server start under a stable hash rather than discovered mid-run.

An older workaround here set `vite.ssr.optimizeDeps.exclude` in `astro.config.mjs`. It has been removed, and it had in any case stopped being read: the adapter merges only top-level `config.vite.optimizeDeps`, never `config.vite.ssr.optimizeDeps`. Verified with a cold `node_modules/.vite` and two full passes over every route. Dev-only - the optimizer does not run during `astro build`, so production was never affected.

## Expected results

With `routes` stripped:

- `/` returns 200
- `/skills` returns 301 to `/expertise`
- `/index.xml` returns **410 Gone**, not a redirect - defunct Hugo-era feed paths are in the `GONE` set in `src/worker.ts` deliberately, to avoid Google's soft-404 classification

Redirect `Location` hosts will point at `127.0.0.1:<port>` locally. The naked-domain to-`www` branch in `src/worker.ts` only fires for `hostname === 'henriksoderlund.com'`, so it stays dormant on localhost and resolves to `https://www.henriksoderlund.com` in production.

The authoritative check remains the post-deploy smoke test in `.github/workflows/deploy.yml`, which runs against the deployed site and asserts both status codes and body sizes.
