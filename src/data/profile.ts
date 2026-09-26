import type { Profile } from './types';

// Placeholder content — replace every value with your own. The build type-checks this file,
// so a missing field or a malformed date ("2023" or "2023-04") stops it with a clear error.
export const profile: Profile = {
  name: 'Jonas Ahlers',
  role: 'Software Engineer',
  tagline:
    'I build reliable, thoughtfully designed software, from backend services to the interfaces people use every day.',
  location: 'Denmark',
  about: [
    'I’m a software engineer who enjoys turning messy, real-world problems into simple and dependable products. I care about clean architecture, fast feedback loops, and interfaces that feel effortless.',
    'Right now I work on e-commerce systems that serve customers in many markets. Before that I built internal tools and APIs, and taught algorithms and data structures at university.',
    'Away from the keyboard you’ll find me on a trail, tinkering with side projects, or reading about how great engineering teams work.',
  ],
  email: 'jonasahlers@gmail.com',
  contactNote:
    'I’m always happy to talk about new opportunities, interesting problems, or just say hello. Email is the quickest way to reach me.',
  socials: [
    { label: 'GitHub', href: 'https://github.com/jonasahlers', icon: 'github' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jonasahlers', icon: 'linkedin' },
  ],
  experience: [
    {
      role: 'Software Engineer',
      company: 'Northwind Traders',
      href: 'https://example.com',
      start: '2023-08',
      summary:
        'Build and maintain the e-commerce platform behind online sales in 30+ markets. Led the move of checkout to a modern React stack, cutting page load times by 40%.',
      tech: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Azure'],
    },
    {
      role: 'Software Developer, part-time',
      company: 'Contoso',
      href: 'https://example.com',
      start: '2021-09',
      end: '2023-06',
      summary:
        'Developed internal tools and REST APIs used daily by 300+ employees, and set up automated testing and deployments for the team.',
      tech: ['C#', '.NET', 'SQL Server', 'Docker'],
    },
    {
      role: 'Teaching Assistant',
      company: 'Northbridge University',
      start: '2020-02',
      end: '2021-06',
      summary: 'Taught weekly exercise classes in algorithms and data structures and graded assignments for 40 students.',
      tech: ['Java', 'Python'],
    },
  ],
  projects: [
    {
      name: 'Trail Planner',
      description: 'An offline-first route planner with elevation profiles and GPX export.',
      href: 'https://example.com',
      repo: 'https://github.com/jonasahlers',
      tech: ['TypeScript', 'React Native', 'SQLite'],
    },
    {
      name: 'budget-cli',
      description: 'A fast terminal tool for tracking expenses, with monthly reports and CSV import.',
      repo: 'https://github.com/jonasahlers',
      tech: ['Rust'],
    },
    {
      name: 'This website',
      description: 'A one-page CV built with Astro: no JavaScript required, deployed to GitHub Pages on every push.',
      repo: 'https://github.com/jonasahlers/jonasahlers.github.io',
      tech: ['Astro', 'TypeScript', 'CSS'],
    },
  ],
  skills: [
    { label: 'Languages', items: ['TypeScript', 'JavaScript', 'C#', 'Python', 'SQL'] },
    { label: 'Frameworks', items: ['React', 'Node.js', '.NET', 'Astro'] },
    { label: 'Tools', items: ['Git', 'Docker', 'Azure', 'GitHub Actions', 'PostgreSQL'] },
    { label: 'Practices', items: ['Testing', 'CI/CD', 'Accessibility', 'API design'] },
  ],
  education: [
    {
      degree: 'MSc in Computer Science',
      school: 'Northbridge University',
      start: '2021',
      end: '2023',
      details: 'Specialised in distributed systems and human–computer interaction.',
    },
    { degree: 'BSc in Computer Science', school: 'Northbridge University', start: '2018', end: '2021' },
  ],
};
