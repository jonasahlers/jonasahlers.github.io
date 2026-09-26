import type { Profile } from '../data/types';

/** schema.org Person markup, so search engines can show a rich profile result. */
export function personJsonLd(profile: Profile, url: string) {
  const currentJob = profile.experience.find((job) => job.end === undefined);
  const sameAs = profile.socials.map((link) => link.href);
  const knowsAbout = profile.skills.flatMap((group) => group.items);
  const schools = [...new Set(profile.education.map((entry) => entry.school))];
  const mentions = profile.references.map(({ title, href }) => ({
    '@type': 'CreativeWork',
    name: title,
    ...(href ? { url: href } : {}),
  }));
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    ...(profile.alternateName ? { alternateName: profile.alternateName } : {}),
    jobTitle: profile.role,
    description: profile.tagline,
    url,
    ...(sameAs.length > 0 ? { sameAs } : {}),
    ...(knowsAbout.length > 0 ? { knowsAbout } : {}),
    ...(profile.location ? { homeLocation: { '@type': 'Place', name: profile.location } } : {}),
    ...(currentJob ? { worksFor: { '@type': 'Organization', name: currentJob.company } } : {}),
    ...(schools.length > 0
      ? { alumniOf: schools.map((name) => ({ '@type': 'EducationalOrganization', name })) }
      : {}),
    ...(mentions.length > 0 ? { subjectOf: mentions } : {}),
  };
}
