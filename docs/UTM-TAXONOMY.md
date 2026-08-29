# UTM taxonomy

The tagging convention for every link Henrik controls that points at
<https://www.henriksoderlund.com>. Direct traffic was 77% of sessions over the
year to 2026-08-29 and is the site's largest unreadable channel; tagging the
owned surfaces is what makes it legible.

## Convention

| Parameter | Rule |
|---|---|
| `utm_source` | Platform, lower case, no dots. Stable across campaigns. |
| `utm_medium` | A value GA4's default channel grouping recognises. Never invent one. |
| `utm_campaign` | `yyyymm-slug` - ISO month first so campaigns sort chronologically. |
| `utm_content` | Distinguishes several links inside the same asset. |

**`utm_medium` must come from GA4's recognised set** - `social`, `email`,
`referral`, `organic`, `cpc`, `affiliate`, `display`. Anything else lands in
Unassigned, which is where the historic `profile` and `resume` values went. A
document or a slide deck is a `referral`; the fact that it is a PDF belongs in
`utm_source`, not `utm_medium`.

## The links

Evergreen surfaces (profile fields, signature) keep the campaign they were first
tagged with - do not re-stamp the month each time, or the same surface fragments
across many campaign rows.

| Surface | source | medium | campaign | content |
|---|---|---|---|---|
| LinkedIn profile website field | `linkedin` | `social` | `202608-profile-link` | `profile-website-field` |
| LinkedIn post or article | `linkedin` | `social` | `yyyymm-<topic>` | `post-link` |
| GitHub profile bio | `github` | `referral` | `202608-profile-link` | `bio-website-field` |
| Email signature | `email-signature` | `email` | `202608-signature` | `signature-link` |
| Proposal or invoice PDF | `document` | `referral` | `yyyymm-proposal-<type>` | `pdf-link` |
| Talk or conference slides | `talk` | `referral` | `yyyymm-<event>` | `slide-link` |
| Resume / CV | `resume` | `referral` | `202608-cv` | `contact-link` |

## Redirects keep campaign parameters

`src/worker.ts` strips the query string when it 301s a legacy path, which would
have thrown away the tags on any link printed against an old URL. The
`CAMPAIGN_PARAMS` allowlist there preserves `utm_*` and the ad click ids across
the hop. A tagged link still points at the live URL wherever possible - one hop
fewer is one fewer thing to lose.

The post-deploy smoke test in `.github/workflows/deploy.yml` asserts this against
the live site: it tags `/skills`, `/consultation` and a `/blog/` path, and fails
the deploy if the `Location` header loses the campaign parameters or carries a
non-campaign one through.

## Verification

After the first click on a newly tagged surface, confirm in GA4 Realtime that the
session carries the intended source, medium and campaign, and that Default
Channel Group is not Unassigned. Unassigned means the medium was rejected.
