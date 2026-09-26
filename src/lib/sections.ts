import type { Profile } from '../data/types';

export type SectionId = 'about' | 'experience' | 'education' | 'projects' | 'skills' | 'references' | 'contact';

/** The page's sections in order. One whose list is empty is left out of both the page and the nav. */
export function visibleSections(profile: Profile): SectionId[] {
  const sections: [SectionId, boolean][] = [
    ['about', profile.about.length > 0],
    ['experience', profile.experience.length > 0],
    ['education', profile.education.length > 0],
    ['projects', profile.projects.length > 0],
    ['skills', profile.skills.length > 0],
    ['references', profile.references.length > 0],
    ['contact', true],
  ];
  return sections.filter(([, show]) => show).map(([id]) => id);
}
