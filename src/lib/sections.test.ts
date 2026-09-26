import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { Profile } from '../data/types';
import { visibleSections } from './sections.ts';

const full: Profile = {
  name: 'Ada Lovelace',
  role: 'Engineer',
  tagline: 'Builds things.',
  about: ['Hello.'],
  email: 'ada@example.com',
  contactNote: 'Say hi.',
  socials: [],
  experience: [{ role: 'Engineer', company: 'Co', start: '2021', summary: 'Work.' }],
  projects: [{ name: 'Thing', description: 'A thing.' }],
  skills: [{ label: 'Languages', items: ['TypeScript'] }],
  education: [{ degree: 'BSc', school: 'Uni', start: '2018', end: '2021' }],
  references: [{ title: 'Article', source: 'Magazine', date: '2026' }],
};


test('lists every section in page order', () => {
  assert.deepEqual(visibleSections(full), ['about', 'experience', 'education', 'projects', 'skills', 'references', 'contact']);
});

test('leaves out a section whose list is empty', () => {
  assert.deepEqual(visibleSections({ ...full, experience: [], education: [], references: [] }), ['about', 'projects', 'skills', 'contact']);
});

test('always keeps the contact section', () => {
  assert.deepEqual(visibleSections({ ...full, about: [], experience: [], projects: [], skills: [], education: [], references: [] }), ['contact']);
});
