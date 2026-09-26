import type { Profile } from '../data/types';

export interface SectionLink {
  id: string;
  label: string;
}

/** The page's sections in order. One whose list is empty is left out of both the page and the nav. */
export function visibleSections(profile: Profile): SectionLink[] {
  return [
    profile.about.length > 0 && { id: 'about', label: 'About' },
    profile.experience.length > 0 && { id: 'experience', label: 'Experience' },
    profile.education.length > 0 && { id: 'education', label: 'Education' },
    profile.projects.length > 0 && { id: 'projects', label: 'Projects' },
    profile.skills.length > 0 && { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Contact' },
  ].filter((section) => section !== false);
}
