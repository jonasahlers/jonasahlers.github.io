import type { Profile } from './types';

// All personal content lives here. The build type-checks this file, so a missing field or a
// malformed date ("2023" or "2023-04") stops it with a clear error.
export const profile: Profile = {
  name: 'Jonas Ahlers',
  role: 'Software Developer',
  tagline: 'Computer science master’s student at Aarhus University and student programmer at hummel.',
  location: 'Aarhus, Denmark',
  about: [
    'I’m a master’s student in computer science at Aarhus University, specializing in data-intensive systems and cryptology.',
    'Alongside my studies I work as a student programmer on hummel’s IT Business Central development team, where I develop and maintain solutions using Microsoft Business Central.',
    'For my bachelor’s project I accelerated single-source shortest path on the GPU: a parallel CUDA implementation, benchmarked against CPU-based versions for a significant speedup.',
  ],
  email: 'jonasahlers@gmail.com',
  contactNote: 'Want to talk about a role, a project, or anything on this page? Email is the quickest way to reach me.',
  socials: [
    { label: 'GitHub', href: 'https://github.com/jonasahlers', icon: 'github' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jonas-ahlers-185274250/', icon: 'linkedin' },
  ],
  experience: [
    {
      role: 'Student Programmer',
      company: 'hummel',
      href: 'https://hummel.net',
      start: '2023',
      summary:
        'Part of hummel’s IT Business Central development team: I develop and maintain solutions using Microsoft Business Central.',
      tech: ['Microsoft Business Central'],
    },
    {
      role: 'Hotel Staff',
      company: 'Danski / Skinetworks',
      start: '2020',
      end: '2020',
      summary: 'A winter season in Alpe d’Huez, France: customer service and a wide range of tasks within the hotel.',
    },
  ],
  projects: [
    {
      name: 'GPU-accelerated shortest paths',
      description:
        'Bachelor project (2024): a parallel algorithm for the single-source shortest path (SSSP) problem in CUDA, with optimized memory access and thread synchronization. Benchmarked against CPU-based implementations, it achieved a significant speedup.',
      tech: ['CUDA C++', 'Parallel programming', 'Benchmarking'],
    },
    {
      name: 'This website',
      description: 'My one-page CV, built with Astro and TypeScript and deployed to GitHub Pages by GitHub Actions on every push.',
      repo: 'https://github.com/jonasahlers/jonasahlers.github.io',
      tech: ['Astro', 'TypeScript', 'CSS'],
    },
  ],
  skills: [
    {
      label: 'Programming',
      items: ['Python', 'Java', 'CUDA C++', 'JavaScript', 'SQL', 'R', 'Scala', 'OCaml', 'ARM & x86 assembly'],
    },
    { label: 'Web', items: ['HTML', 'CSS', 'JavaScript'] },
    { label: 'Databases', items: ['MySQL', 'SQLite'] },
    { label: 'Tools', items: ['Git', 'Docker', 'DevOps', 'Jira'] },
    { label: 'Spoken languages', items: ['Danish (native)', 'English (fluent)', 'German (conversational)'] },
  ],
  education: [
    {
      degree: 'MSc in Computer Science',
      school: 'Aarhus University',
      href: 'https://www.au.dk',
      start: '2024',
      details: 'Specializing in data-intensive systems and cryptology.',
    },
    {
      degree: 'BSc in Computer Science',
      school: 'Aarhus University',
      href: 'https://www.au.dk',
      start: '2021',
      end: '2024',
      details: 'Bachelor project: Accelerating Single-Source Shortest Path on GPU: A Parallel Programming Approach.',
    },
    { degree: 'Upper secondary school (STX)', school: 'Risskov Gymnasium', start: '2016', end: '2019' },
  ],
};
