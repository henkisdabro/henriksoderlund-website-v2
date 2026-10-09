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
| `utm_campaign` | An evergreen slug naming the surface or theme. No years, no dates - the same surface keeps the same campaign for its whole life. |
| `utm_content` | Distinguishes several links inside the same asset. |

**`utm_medium` must come from GA4's recognised set** - `social`, `email`,
`referral`, `organic`, `cpc`, `affiliate`, `display`. Anything else lands in
Unassigned, which is where the historic `profile` and `resume` values went. A
document or a slide deck is a `referral`; the fact that it is a PDF belongs in
`utm_source`, not `utm_medium`.

## The links

Every campaign below is evergreen: a surface keeps its campaign for good, and a
link is never re-stamped. Time is already on the session in GA4 - putting it in
the campaign only fragments one surface across many rows. Where a slug takes a
placeholder, fill it with the topic, type or event, not a date.

| Surface | source | medium | campaign | content |
|---|---|---|---|---|
| LinkedIn profile website field | `linkedin` | `social` | `profile-link` | `profile-website-field` |
| LinkedIn post or article | `linkedin` | `social` | `post-<topic>` | `post-link` |
| GitHub profile bio | `github` | `referral` | `profile-link` | `bio-website-field` |
| Email signature | `email` | `email` | `signature` | `signature-link` |
| Proposal or invoice PDF | `document` | `referral` | `proposal-<type>` | `pdf-link` |
| Talk or conference slides | `talk` | `referral` | `talk-<event>` | `slide-link` |
| Resume / CV | `resume` | `referral` | `cv` | `contact-link` |
| sandcastle-kit site, author credit | `sandcastle-kit` | `referral` | `oss-sandcastle-kit` | `footer-author-link` |
| sandcastle-kit site, more work link | `sandcastle-kit` | `referral` | `oss-sandcastle-kit` | `more-work-link` |
| sandcastle-kit README, author link | `github` | `referral` | `oss-sandcastle-kit` | `readme-author-link` |

An open-source project site is its own source - the project slug, not the host
(`github-pages` would lump every project site into one row). The campaign is
`oss-<project>` for every surface of that project, so filtering on it gives the
project's whole referral footprint, site and README together.

The three sandcastle-kit links were checked live on 20261002: both footer
links on <https://henkisdabro.github.io/sandcastle-kit/> and the README author
link carry exactly the tags above, and the repo's Website field points at the
site.

## Links out to Henrik's own products

The same convention runs in reverse for links from this site to ascribe and
Rotto Snorkel. Every external link here is `rel="noreferrer"`, so without tags
those visits arrive referrer-less and land in Direct. `productLink()` in
`src/data/links.ts` adds the tags; the canonical URL stays untagged in the data
and in structured data.

| Placement | source | medium | campaign | content |
|---|---|---|---|---|
| Homepage "Things I've built" | `henriksoderlund` | `referral` | `portfolio` | `home-built-link` |
| /builds card "Visit" link | `henriksoderlund` | `referral` | `portfolio` | `builds-visit-link` |
| /builds fullscreen overlay "Visit" link | `henriksoderlund` | `referral` | `portfolio` | `builds-overlay-link` |

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
