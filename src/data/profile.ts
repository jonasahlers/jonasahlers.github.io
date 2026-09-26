import { localize, type Localized } from '../i18n/localize';
import type { Locale } from '../i18n/locales';
import type { Profile } from './types';

// All personal content lives here. Text that differs between languages is written as
// { da: '…', en: '…' }; plain strings are shared by both. The build type-checks this file, so a
// missing field or a malformed date ("2023" or "2023-04") stops it with a clear error.
export const profile: Localized<Profile> = {
  name: 'Jonas Ahlers',
  role: { da: 'Softwareudvikler', en: 'Software Developer' },
  tagline: {
    da: 'Kandidatstuderende i datalogi ved Aarhus Universitet og studenterprogrammør hos hummel.',
    en: 'Computer science master’s student at Aarhus University and student programmer at hummel.',
  },
  location: { da: 'Aarhus, Danmark', en: 'Aarhus, Denmark' },
  about: [
    {
      da: 'Jeg læser en kandidat i datalogi ved Aarhus Universitet med specialisering i dataintensive systemer og kryptologi.',
      en: 'I’m a master’s student in computer science at Aarhus University, specializing in data-intensive systems and cryptology.',
    },
    {
      da: 'Ved siden af studiet arbejder jeg som studenterprogrammør i hummels IT Business Central-udviklingsteam, hvor jeg udvikler og vedligeholder løsninger i Microsoft Business Central.',
      en: 'Alongside my studies I work as a student programmer on hummel’s IT Business Central development team, where I develop and maintain solutions using Microsoft Business Central.',
    },
    {
      da: 'I mit bachelorprojekt gjorde jeg single-source shortest path hurtigere på GPU’en: en parallel implementering i CUDA, der i benchmarks mod CPU-baserede versioner gav en markant speedup.',
      en: 'For my bachelor’s project I accelerated single-source shortest path on the GPU: a parallel CUDA implementation, benchmarked against CPU-based versions for a significant speedup.',
    },
  ],
  email: 'jonasahlers@gmail.com',
  contactNote: {
    da: 'Vil du tale om en stilling, et projekt eller noget helt tredje? Skriv en mail – det er den hurtigste vej til mig.',
    en: 'Want to talk about a role, a project, or anything on this page? Email is the quickest way to reach me.',
  },
  socials: [
    { label: 'GitHub', href: 'https://github.com/jonasahlers', icon: 'github' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jonas-ahlers-185274250/', icon: 'linkedin' },
  ],
  experience: [
    {
      role: { da: 'Studenterprogrammør', en: 'Student Programmer' },
      company: 'hummel',
      href: 'https://hummel.net',
      start: '2023',
      summary: {
        da: 'En del af hummels IT Business Central-udviklingsteam: jeg udvikler og vedligeholder løsninger i Microsoft Business Central.',
        en: 'Part of hummel’s IT Business Central development team: I develop and maintain solutions using Microsoft Business Central.',
      },
      tech: ['Microsoft Business Central'],
    },
    {
      role: { da: 'Hotelmedarbejder', en: 'Hotel Staff' },
      company: 'Danski / Skinetworks',
      start: '2020',
      end: '2020',
      summary: {
        da: 'En vintersæson i Alpe d’Huez, Frankrig: kundeservice og mange forskellige opgaver på hotellet.',
        en: 'A winter season in Alpe d’Huez, France: customer service and a wide range of tasks within the hotel.',
      },
    },
  ],
  projects: [
    {
      name: { da: 'GPU-accelererede korteste veje', en: 'GPU-accelerated shortest paths' },
      description: {
        da: 'Bachelorprojekt (2024): en parallel algoritme til single-source shortest path-problemet (SSSP) i CUDA med optimeret hukommelsesadgang og trådsynkronisering. I benchmarks mod CPU-baserede implementeringer gav den en markant speedup.',
        en: 'Bachelor project (2024): a parallel algorithm for the single-source shortest path (SSSP) problem in CUDA, with optimized memory access and thread synchronization. Benchmarked against CPU-based implementations, it achieved a significant speedup.',
      },
      tech: ['CUDA C++', { da: 'Parallel programmering', en: 'Parallel programming' }, 'Benchmarking'],
    },
    {
      name: { da: 'Denne hjemmeside', en: 'This website' },
      description: {
        da: 'Mit CV på én side, bygget med Astro og TypeScript og udgivet på GitHub Pages af GitHub Actions ved hvert push.',
        en: 'My one-page CV, built with Astro and TypeScript and deployed to GitHub Pages by GitHub Actions on every push.',
      },
      repo: 'https://github.com/jonasahlers/jonasahlers.github.io',
      tech: ['Astro', 'TypeScript', 'CSS'],
    },
  ],
  skills: [
    {
      label: { da: 'Programmering', en: 'Programming' },
      items: ['Python', 'Java', 'CUDA C++', 'JavaScript', 'SQL', 'R', 'Scala', 'OCaml', 'ARM & x86 assembly'],
    },
    { label: 'Web', items: ['HTML', 'CSS', 'JavaScript'] },
    { label: { da: 'Databaser', en: 'Databases' }, items: ['MySQL', 'SQLite'] },
    { label: { da: 'Værktøjer', en: 'Tools' }, items: ['Git', 'Docker', 'DevOps', 'Jira'] },
    {
      label: { da: 'Sprog', en: 'Spoken languages' },
      items: [
        { da: 'Dansk (modersmål)', en: 'Danish (native)' },
        { da: 'Engelsk (flydende)', en: 'English (fluent)' },
        { da: 'Tysk (samtaleniveau)', en: 'German (conversational)' },
      ],
    },
  ],
  education: [
    {
      degree: { da: 'Kandidat i datalogi', en: 'MSc in Computer Science' },
      school: { da: 'Aarhus Universitet', en: 'Aarhus University' },
      href: 'https://www.au.dk',
      start: '2024',
      details: {
        da: 'Specialisering i dataintensive systemer og kryptologi.',
        en: 'Specializing in data-intensive systems and cryptology.',
      },
    },
    {
      degree: { da: 'Bachelor i datalogi', en: 'BSc in Computer Science' },
      school: { da: 'Aarhus Universitet', en: 'Aarhus University' },
      href: 'https://www.au.dk',
      start: '2021',
      end: '2024',
      details: {
        da: 'Bachelorprojekt: Accelerating Single-Source Shortest Path on GPU: A Parallel Programming Approach.',
        en: 'Bachelor project: Accelerating Single-Source Shortest Path on GPU: A Parallel Programming Approach.',
      },
    },
    {
      degree: { da: 'Studentereksamen (STX)', en: 'Upper secondary school (STX)' },
      school: 'Risskov Gymnasium',
      start: '2016',
      end: '2019',
    },
  ],
};

/** The profile with every translation resolved to one language. */
export function getProfile(locale: Locale): Profile {
  return localize<Profile>(profile, locale);
}
