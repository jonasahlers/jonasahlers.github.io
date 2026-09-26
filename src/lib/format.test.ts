import assert from 'node:assert/strict';
import { test } from 'node:test';
import { formatPeriod, initials } from './format.ts';

test('formats a range of years', () => {
  assert.equal(formatPeriod('2021', '2023'), '2021 — 2023');
});

test('uses "Present" for an ongoing period', () => {
  assert.equal(formatPeriod('2023'), '2023 — Present');
  assert.equal(formatPeriod('2023-04'), 'Apr\u00a02023 — Present');
});

test('shows months when they are given, glued to their year', () => {
  assert.equal(formatPeriod('2021-06', '2023-03'), 'Jun\u00a02021 — Mar\u00a02023');
});

test('collapses a period within one year', () => {
  assert.equal(formatPeriod('2022', '2022'), '2022');
  assert.equal(formatPeriod('2022-06', '2022-08'), 'Jun — Aug\u00a02022');
  assert.equal(formatPeriod('2022-06', '2022-06'), 'Jun\u00a02022');
  assert.equal(formatPeriod('2022-06', '2022'), '2022');
});

test('accepts a custom separator for screen-reader text', () => {
  assert.equal(formatPeriod('2021', '2023', ' to '), '2021 to 2023');
  assert.equal(formatPeriod('2022-06', '2022-08', ' to '), 'Jun to Aug\u00a02022');
});

test('rejects malformed dates with a helpful message', () => {
  assert.throws(() => formatPeriod('2021-13'), /Invalid date "2021-13"/);
  assert.throws(() => formatPeriod('2021-6'), /Invalid date "2021-6"/);
  assert.throws(() => formatPeriod('21'), /Invalid date "21"/);
});

test('rejects an end date before the start date', () => {
  assert.throws(() => formatPeriod('2023', '2021'), /ends before it starts/);
  assert.throws(() => formatPeriod('2022-08', '2022-06'), /ends before it starts/);
});

test('initials use the first and last name', () => {
  assert.equal(initials('Jonas Ahlers'), 'JA');
  assert.equal(initials('  ada  '), 'A');
  assert.equal(initials('Mary Jane Watson'), 'MW');
});
