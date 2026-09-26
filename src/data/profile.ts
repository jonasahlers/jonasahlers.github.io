import { localize, type Localized } from '../i18n/localize';
import type { Locale } from '../i18n/locales';
import type { Profile } from './types';

// All personal content lives here. Text that differs between languages is written as
// { da: '…', en: '…' }; plain strings are shared by both. The build type-checks this file, so a
// missing field or a malformed date ("2023" or "2023-04") stops it with a clear error.
export const profile: Localized<Profile> = {
  name: 'Jonas Ahlers',
  alternateName: 'Jonas Ahlers Nielsen',
  role: { da: 'Softwareudvikler', en: 'Software Developer' },
  tagline: {
    da: 'Junior integrationsudvikler hos hummel med en kandidatgrad i datalogi fra Aarhus Universitet.',
    en: 'Junior Integration Developer at hummel, with an MSc in Computer Science from Aarhus University.',
  },
  location: { da: 'Aarhus, Danmark', en: 'Aarhus, Denmark' },
  about: [
    {
      da: 'Jeg er junior integrationsudvikler hos hummel i Aarhus, hvor jeg bygger og vedligeholder de integrationer, der forbinder vores systemer og samarbejdspartnere.',
      en: 'I’m a Junior Integration Developer at hummel in Aarhus, building and maintaining the integrations that connect our systems and partners.',
    },
    {
      da: 'Jeg har en kandidatgrad i datalogi fra Aarhus Universitet med specialisering i dataintensive systemer og kryptologi. I mit speciale implementerede vi LEAST, et foreslået post-kvante threshold-signaturskema.',
      en: 'I hold an MSc in Computer Science from Aarhus University, specializing in data-intensive systems and cryptology. For my master’s thesis we implemented LEAST, a proposed post-quantum threshold signature scheme.',
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
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jonas-ahlers1/', icon: 'linkedin' },
  ],
  experience: [
    {
      role: { da: 'Junior integrationsudvikler', en: 'Junior Integration Developer' },
      company: 'hummel',
      start: '2026-08',
      summary: {
        da: 'Fuldtid. Jeg bygger og vedligeholder de integrationer, der forbinder hummels systemer og samarbejdspartnere.',
        en: 'Full-time. I build and maintain the integrations that connect hummel’s systems and partners.',
      },
    },
    {
      role: {
        da: 'Studentermedhjælper, BC-udvikling og integration',
        en: 'Student Worker, BC Development and Integration',
      },
      company: 'hummel',
      start: '2023-04',
      end: '2026-08',
      summary: {
        da: 'Deltid ved siden af studiet i hummels IT-udviklingsteam: udvikling og vedligeholdelse af løsninger i Microsoft Business Central samt integrationsudvikling.',
        en: 'Part-time alongside my studies on hummel’s IT development team: developing and maintaining Microsoft Business Central solutions, plus integration development.',
      },
      tech: ['Microsoft Business Central', 'Dynamics NAV', '.NET'],
    },
    {
      role: { da: 'Hotelmedarbejder', en: 'Hotel Staff' },
      company: 'Danski / Skinetworks',
      start: '2019-12',
      end: '2020-03',
      summary: {
        da: 'En vintersæson i Alpe d’Huez, Frankrig: kundeservice og mange forskellige opgaver på hotellet.',
        en: 'A winter season in Alpe d’Huez, France: customer service and a wide range of tasks within the hotel.',
      },
    },
    {
      role: { da: 'Rengøringsassistent', en: 'Cleaning Assistant' },
      company: 'Demenscentrum',
      start: '2018-07',
      end: '2019-12',
      summary: {
        da: 'Deltidsjob med rengøring på et demenscenter i Aarhus.',
        en: 'Part-time cleaning job at a dementia care centre in Aarhus.',
      },
    },
  ],
  projects: [
    {
      name: { da: 'Post-kvante threshold-signaturer (LEAST)', en: 'Post-quantum threshold signatures (LEAST)' },
      description: {
        da: 'Speciale (2026) med to medstuderende, vejledt af Diego F. Aranha: en implementering af LEAST, et foreslået kodebaseret threshold-signaturskema, der er indsendt til NISTs call for multi-party threshold-skemaer. Det deler en LESS-signeringsnøgle mellem N parter, så hvilke som helst T af dem kan signere sammen, med aktiv sikkerhed mod en uærlig majoritet.',
        en: 'Master’s thesis (2026) with two fellow students, supervised by Diego F. Aranha: an implementation of LEAST, a proposed code-based threshold signature scheme submitted to NIST’s call for multi-party threshold schemes. It splits a LESS signing key among N parties so that any T of them can sign together, with active security against a dishonest majority.',
      },
      tech: [
        { da: 'Post-kvante-kryptografi', en: 'Post-quantum cryptography' },
        { da: 'Threshold-signaturer', en: 'Threshold signatures' },
        'MPC',
      ],
    },
    {
      name: { da: 'GPU-accelererede korteste veje', en: 'GPU-accelerated shortest paths' },
      description: {
        da: 'Bachelorprojekt (2024): en parallel algoritme til single-source shortest path-problemet (SSSP) i CUDA med optimeret hukommelsesadgang og trådsynkronisering. I benchmarks mod CPU-baserede implementeringer gav den en markant speedup.',
        en: 'Bachelor project (2024): a parallel algorithm for the single-source shortest path (SSSP) problem in CUDA, with optimized memory access and thread synchronization. Benchmarked against CPU-based implementations, it achieved a significant speedup.',
      },
      tech: ['CUDA C++', { da: 'Parallel programmering', en: 'Parallel programming' }, 'Benchmarking'],
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
      end: '2026',
      details: {
        da: 'Specialisering i dataintensive systemer og kryptologi. Speciale: Post Quantum Threshold Digital Signature Scheme with LEAST.',
        en: 'Specialized in data-intensive systems and cryptology. Master’s thesis: Post Quantum Threshold Digital Signature Scheme with LEAST.',
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
  references: [
    {
      title: 'Studerende fandt sikkerhedshuller i Nettos app',
      titleLang: 'da',
      source: {
        da: 'Aktuel Naturvidenskab nr. 3/2026, s. 22–23',
        en: 'Aktuel Naturvidenskab no. 3/2026, pp. 22–23',
      },
      date: '2026',
      href: 'https://aktuelnaturvidenskab.dk/find-artikel/nyeste-numre/3-2026/studerende-fandt-sikkerhedshuller-i-nettos-app',
      summary: {
        da: 'Artikel af Henriette Stevnhøj om, hvordan jeg (nævnt som Jonas Ahlers Nielsen) og to medstuderende fandt sikkerhedshuller i Nettos betalingsapp i kurset Systems Security. Salling Group rettede fejlene kort efter.',
        en: 'Feature by Henriette Stevnhøj on how two fellow students and I (named as Jonas Ahlers Nielsen) found security flaws in Netto’s payment app in the Systems Security course. Salling Group fixed them shortly after.',
      },
    },
    {
      title: 'Systems Security Hall of Fame',
      titleLang: 'en',
      source: { da: 'Diego F. Aranha, Aarhus Universitet', en: 'Diego F. Aranha, Aarhus University' },
      date: '2026',
      href: 'https://dfaranha.github.io/post/syssec-hof/',
      summary: {
        da: 'Samme analyse kom med i 2025-udgaven af kursets Hall of Fame, som fremhæver ansvarlige offentliggørelser, der har ført til rettelser i rigtige systemer.',
        en: 'The same analysis made the course’s 2025 Hall of Fame, which highlights coordinated disclosures that led to fixes in real systems.',
      },
    },
  ],
};

/** The profile with every translation resolved to one language. */
export function getProfile(locale: Locale): Profile {
  return localize<Profile>(profile, locale);
}
