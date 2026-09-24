import { test, expect } from '@playwright/test';
import {
  CONTAINER_OWN_EVENTS,
  GTM_ID,
  UNTRACKED_EVENTS,
  ga4TagsFor,
  loadContainer,
  sourceEvents,
  triggerEventNames,
  type Container,
} from './gtm';

// Runs on every PR and daily against the published container, so it fails on
// drift from either side: a site change GTM was not updated for, or a GTM
// publish that dropped something the site relies on.

let container: Container;
test.beforeAll(async () => {
  container = await loadContainer();
});

test('every dataLayer event the site pushes reaches a GA4 tag', () => {
  for (const [event, file] of sourceEvents()) {
    if (event in UNTRACKED_EVENTS) continue;
    expect
      .soft(
        ga4TagsFor(container, event).length,
        `'${event}' (pushed in ${file}) fires no GA4 tag in ${GTM_ID}. ` +
          'Add a trigger and GA4 event tag in GTM and publish, or list it in UNTRACKED_EVENTS with a reason.'
      )
      .toBeGreaterThan(0);
  }
});

test('no GTM trigger waits for an event the site no longer pushes', () => {
  const pushed = sourceEvents();
  for (const name of triggerEventNames(container)) {
    if (name.startsWith('gtm.') || name.startsWith('/') || name in CONTAINER_OWN_EVENTS) continue;
    expect
      .soft(
        pushed.has(name),
        `${GTM_ID} has a trigger for '${name}', which nothing in src/ pushes - ` +
          'likely renamed on the site. Point the trigger at the new name and publish.'
      )
      .toBe(true);
  }
});

test('UNTRACKED_EVENTS lists only events the site still pushes', () => {
  const pushed = sourceEvents();
  for (const event of Object.keys(UNTRACKED_EVENTS)) {
    expect.soft(pushed.has(event), `stale UNTRACKED_EVENTS entry '${event}'`).toBe(true);
  }
});
