import assert from 'node:assert/strict';
import { test } from 'node:test';
import { localize } from './localize.ts';

test('picks the translation for the locale', () => {
  assert.equal(localize<string>({ da: 'Hej', en: 'Hello' }, 'da'), 'Hej');
  assert.equal(localize<string>({ da: 'Hej', en: 'Hello' }, 'en'), 'Hello');
});

test('keeps plain values shared by both languages', () => {
  assert.equal(localize<string>('Jonas Ahlers', 'da'), 'Jonas Ahlers');
  assert.equal(localize<number>(42, 'en'), 42);
  assert.equal(localize<string | undefined>(undefined, 'en'), undefined);
});

test('resolves nested objects and arrays', () => {
  const value = {
    role: { da: 'Udvikler', en: 'Developer' },
    start: '2023',
    tech: ['CUDA C++', { da: 'Parallel programmering', en: 'Parallel programming' }],
  };
  assert.deepEqual(localize<{ role: string; start: string; tech: string[] }>(value, 'da'), {
    role: 'Udvikler',
    start: '2023',
    tech: ['CUDA C++', 'Parallel programmering'],
  });
});

test('leaves imported images untouched', () => {
  const image = { src: '/_astro/shot.png', width: 640, height: 400, format: 'png' };
  assert.equal(localize<typeof image>(image, 'da'), image);
});
