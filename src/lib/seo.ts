import type { Profile } from '../data/types';

/** schema.org Person markup, so search engines can show a rich profile result. */
export function personJsonLd(profile: Profile, url: string) {
  const currentJob = profile.experience.find((job) => job.end === undefined);
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.role,
    description: profile.tagline,
    url,
    sameAs: profile.socials.map((link) => link.href),
    knowsAbout: profile.skills.flatMap((group) => group.items),
    ...(profile.location ? { homeLocation: { '@type': 'Place', name: profile.location } } : {}),
    ...(currentJob ? { worksFor: { '@type': 'Organization', name: currentJob.company } } : {}),
    ...(profile.education.length > 0
      ? { alumniOf: profile.education.map((entry) => ({ '@type': 'CollegeOrUniversity', name: entry.school })) }
      : {}),
  };
}
