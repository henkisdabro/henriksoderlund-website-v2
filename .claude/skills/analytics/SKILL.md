---
name: analytics
description: GA4, Google Tag Manager and the BigQuery export for henriksoderlund.com via the `gtm`, `ga` and `bq` CLIs, with the account, container and property IDs. Use when adding or changing a dataLayer event or its parameters, editing or publishing the GTM container, changing GA4 key events or custom definitions, or querying GA4 data.
---

# Analytics: GTM, GA4 and BigQuery

An event reaches GA4 only when three layers agree: the site pushes it to the dataLayer, a GTM tag forwards it, and GA4 knows its parameters. A change to one layer is unfinished until the other two match. CI holds the first two together: `tests/e2e/gtm-contract.spec.ts` reads the published container (see `docs/LEAD-CAPTURE-TESTS.md`).

## IDs

| Thing | ID |
|---|---|
| GTM account "Personal Sites" | `44467` |
| GTM container `GTM-KM56HHS2` (www.henriksoderlund.com) | `263990022` |
| GTM environments | Live `1`, Latest `2`, Staging `34` (env-34: what localhost and previews load), Default Workspace preview `35` (env-35, auth `S9fntbamgO9rabwujCue9w`) |
| GA4 property | `344403648` |
| GA4 web stream | `4323279609`, measurement ID `G-DCPX22GDT5` |
| Google tag | `GT-W6KD7RS` |
| BigQuery export | project `www-henriksoderlund-com`, dataset `analytics_344403648` (daily `events_*`, plus `events_intraday_*` for today and yesterday) |

Henrik's `gtm` and `ga` logins reach many client accounts. Pass `--account-id 44467 --container-id 263990022` (and `-p 344403648`) on every call, and leave the CLIs' saved defaults alone. Creating a version replaces the workspace, so look its ID up first with `gtm workspaces list`.

## Adding or changing an event

1. **Site:** push the event from `src/` (delegated clicks live in `src/layouts/BaseLayout.astro`). A new value of an existing parameter needs no GTM change.
2. **GTM:** in the Default Workspace, follow the container's naming:
   - a `DLV - <param>` Data Layer Variable (type `v`, `dataLayerVersion` 2) per new parameter;
   - a `CE - <event>` custom event trigger (`{{_event}}` equals the event);
   - a `GA4 <Title Case Name>` tag (type `gaawe`) with `eventName`, an `eventSettingsTable` row per parameter, `measurementIdOverride` `G-DCPX22GDT5`, `eventSettingsVariable` `{{google tag - event settings}}`, firing `oncePerEvent`.

   Copy the structure from a sibling: `gtm tags get --tag-id 55 -o json` (GA4 Booking Start).
3. **Verify before publishing:** `gtm workspaces preview` compiles the workspace into env-35. Run a scratch Playwright script against the locally served Worker (`node tests/e2e/serve-worker.mjs 8801`, see `docs/LOCAL-WORKER-TESTING.md`) that rewrites the `gtm.js` request from env-34 to env-35, and routes `/g/collect` to a 204 so nothing reaches GA4. Each captured hit carries `en=` (event), `tid`, `cid` (client ID), `sid` (session ID) and `ep.`/`epn.` parameters; the event is right when its `cid` and `sid` match the page_view's and `ep.gtm_container_id_version` reads `QUICK_PREVIEW`. gtag batches hits, so allow ~10 s or close the page to flush.
4. **Publish:** `gtm versions create --workspace-id <id> --name ... --notes "... Rollback: publish version N"`, then `gtm versions publish --version-id <new>`. The contract test fails in both orders until both sides ship: a site PR fails CI until the tag is live, and the daily monitor on `main` fails while a live trigger waits for an unmerged event. So publish, re-run the PR's CI, and merge straight after.
5. **GA4:** register each parameter worth reporting with `ga custom-dimensions create -p 344403648 --parameter-name <p> --display-name <name> --scope EVENT`, or `ga custom-metrics create ... --measurement-unit <UNIT>` for a number. A lead event becomes a key event with `ga key-events create -p 344403648 -e <event> --counting-method ONCE_PER_SESSION`.

Done when the dataLayer push, the published tag and the GA4 definition all exist, and a hit shows the event with its parameters and the page's own `cid` and `sid`.

## Querying

- GA4 reports: `ga reports run -p 344403648 -m eventCount -d eventName --start-date 28daysAgo`; `ga reports realtime` for the last 30 minutes.
- Raw events: `bq query --project_id=www-henriksoderlund-com --use_legacy_sql=false '...'` over `analytics_344403648.events_*`; `event_params` is a repeated key/value field, so `UNNEST` it. Traffic-source fields stay empty in intraday tables until the daily table lands.
- The live container as served: `curl -s 'https://www.googletagmanager.com/gtm.js?id=GTM-KM56HHS2'`, whose `"version"` is the published version.

## Gotchas

- `gtm` and `ga` print text around `-o json` output, and `gtm ... create` prints a table on success. Parse from the first `[` or `{` to the last `]` or `}`, and confirm a create with a `list` rather than its exit output.
- `gtm versions create`, `versions publish` and `workspaces preview` can complete and then hang. Run them under `timeout 90`, then confirm with `gtm version-headers list` or the served `gtm.js`.
- The `gtm` CLI cannot point an environment at a version, so Staging (env-34) changes only in the GTM UI: Admin, Environments, Staging, Publish To.
- GA4 display names accept only letters, digits, underscores and spaces.
- gcloud application-default credentials read GA4 Admin and BigQuery but cannot write to GA4 or reach Tag Manager; `gog` only reads GA4. Writes go through `gtm` and `ga`.
- `ep.bot_detection_verdict` reads `potential_bot_traffic` under Playwright (`navigator.webdriver`). Tags still fire.
