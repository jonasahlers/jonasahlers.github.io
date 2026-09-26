/** A date as "YYYY" or "YYYY-MM", e.g. "2023" or "2023-04". */
export type YearMonth = `${number}` | `${number}-${number}`;

export type SocialIcon = 'github' | 'linkedin' | 'x' | 'mail' | 'globe';

export interface SocialLink {
  label: string;
  href: string;
  icon: SocialIcon;
}

export interface Job {
  role: string;
  company: string;
  /** Company website; makes the whole entry a link. */
  href?: string;
  start: YearMonth;
  /** Leave out for your current job. */
  end?: YearMonth;
  summary: string;
  tech?: string[];
}

export interface Project {
  name: string;
  description: string;
  /** Live site or demo. */
  href?: string;
  /** Source code. */
  repo?: string;
  /** Screenshot imported from src/assets, e.g. `import shot from '../assets/app.png'`. */
  image?: ImageMetadata;
  tech?: string[];
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface Education {
  degree: string;
  school: string;
  href?: string;
  start: YearMonth;
  end?: YearMonth;
  details?: string;
}

export interface Profile {
  name: string;
  role: string;
  /** One sentence under your name; also the page's meta description. */
  tagline: string;
  location?: string;
  /** Square photo imported from src/assets; without it, a monogram of your initials is shown. */
  avatar?: ImageMetadata;
  /** Short status shown as a pill next to your avatar, e.g. "Open to new opportunities". */
  availability?: string;
  /** Paragraphs of the About section. */
  about: string[];
  email: string;
  /** The sentence that opens the Contact section. */
  contactNote: string;
  socials: SocialLink[];
  experience: Job[];
  projects: Project[];
  skills: SkillGroup[];
  education: Education[];
}
