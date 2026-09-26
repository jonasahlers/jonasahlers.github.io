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
};

const ids = (profile: Profile) => visibleSections(profile).map((section) => section.id);

test('lists every section in page order', () => {
  assert.deepEqual(ids(full), ['about', 'experience', 'education', 'projects', 'skills', 'contact']);
  assert.equal(visibleSections(full)[0]?.label, 'About');
});

test('leaves out a section whose list is empty', () => {
  assert.deepEqual(ids({ ...full, experience: [], education: [] }), ['about', 'projects', 'skills', 'contact']);
});

test('always keeps the contact section', () => {
  assert.deepEqual(ids({ ...full, about: [], experience: [], projects: [], skills: [], education: [] }), ['contact']);
});
