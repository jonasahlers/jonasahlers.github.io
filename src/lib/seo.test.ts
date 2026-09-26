import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { Profile } from '../data/types';
import { personJsonLd } from './seo.ts';

const empty: Profile = {
  name: 'Ada Lovelace',
  role: 'Engineer',
  tagline: 'Builds things.',
  about: [],
  email: 'ada@example.com',
  contactNote: 'Say hi.',
  socials: [],
  experience: [],
  projects: [],
  skills: [],
  education: [],
  references: [],
};

test('describes the person', () => {
  const data = personJsonLd(empty, 'https://example.com/');
  assert.equal(data['@type'], 'Person');
  assert.equal(data.name, 'Ada Lovelace');
  assert.equal(data.jobTitle, 'Engineer');
  assert.equal(data.description, 'Builds things.');
  assert.equal(data.url, 'https://example.com/');
});

test('leaves out fields that have no data', () => {
  const data = personJsonLd(empty, 'https://example.com/');
  for (const key of ['sameAs', 'knowsAbout', 'homeLocation', 'worksFor', 'alumniOf']) {
    assert.ok(!(key in data), `unexpected "${key}"`);
  }
});

test('links social profiles, skills, and location', () => {
  const data = personJsonLd(
    {
      ...empty,
      location: 'Denmark',
      socials: [{ label: 'GitHub', href: 'https://github.com/ada', icon: 'github' }],
      skills: [
        { label: 'Languages', items: ['TypeScript', 'SQL'] },
        { label: 'Tools', items: ['Git'] },
      ],
    },
    '',
  );
  assert.deepEqual(data.sameAs, ['https://github.com/ada']);
  assert.deepEqual(data.knowsAbout, ['TypeScript', 'SQL', 'Git']);
  assert.deepEqual(data.homeLocation, { '@type': 'Place', name: 'Denmark' });
});

test('names only the current employer', () => {
  const data = personJsonLd(
    {
      ...empty,
      experience: [
        { role: 'Developer', company: 'Old Co', start: '2019', end: '2021', summary: '' },
        { role: 'Engineer', company: 'Now Co', start: '2021', summary: '' },
      ],
    },
    '',
  );
  assert.deepEqual(data.worksFor, { '@type': 'Organization', name: 'Now Co' });
});

test('lists each school once', () => {
  const data = personJsonLd(
    {
      ...empty,
      education: [
        { degree: 'MSc', school: 'Uni', start: '2021', end: '2023' },
        { degree: 'BSc', school: 'Uni', start: '2018', end: '2021' },
      ],
    },
    '',
  );
  assert.deepEqual(data.alumniOf, [{ '@type': 'EducationalOrganization', name: 'Uni' }]);
});
