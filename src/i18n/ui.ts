import { toLocale, type Locale } from './locales.ts';

// Interface text around the content. The Danish table is typed against the English keys, so a
// missing translation fails the build.
const en = {
  'meta.locale': 'en_GB',
  'skip': 'Skip to content',
  'newTab': '(opens in a new tab)',
  'nav.label': 'Sections',
  'section.about': 'About',
  'section.experience': 'Experience',
  'section.education': 'Education',
  'section.projects': 'Projects',
  'section.skills': 'Skills',
  'section.references': 'References',
  'section.contact': 'Contact',
  'period.to': ' to ',
  'tags.label': 'Technologies',
  'project.source': 'Source code',
  'social.email': 'Email',
  'contact.copy': 'Copy',
  'contact.copyTarget': 'email address',
  'contact.copied': 'Copied',
  'contact.copyFailed': 'Copy failed',
  'contact.copiedStatus': 'Email address copied',
  'contact.copyFailedStatus': 'Couldn’t copy the email address',
  'contact.elsewhere': 'Also on',
  'contact.and': 'and',
  'theme.dark': 'Dark theme',
  'theme.toggle': 'Toggle dark theme',
  'lang.label': 'Language',
  'footer.builtWith': 'Built with',
  'footer.hosted': 'and hosted on GitHub Pages.',
} as const;

type UiKey = keyof typeof en;

const da: Record<UiKey, string> = {
  'meta.locale': 'da_DK',
  'skip': 'Gå til indhold',
  'newTab': '(åbner i en ny fane)',
  'nav.label': 'Sektioner',
  'section.about': 'Om mig',
  'section.experience': 'Erfaring',
  'section.education': 'Uddannelse',
  'section.projects': 'Projekter',
  'section.skills': 'Kompetencer',
  'section.references': 'Referencer',
  'section.contact': 'Kontakt',
  'period.to': ' til ',
  'tags.label': 'Teknologier',
  'project.source': 'Kildekode',
  'social.email': 'E-mail',
  'contact.copy': 'Kopiér',
  'contact.copyTarget': 'e-mailadresse',
  'contact.copied': 'Kopieret',
  'contact.copyFailed': 'Kunne ikke kopiere',
  'contact.copiedStatus': 'E-mailadressen er kopieret',
  'contact.copyFailedStatus': 'E-mailadressen kunne ikke kopieres',
  'contact.elsewhere': 'Også på',
  'contact.and': 'og',
  'theme.dark': 'Mørkt tema',
  'theme.toggle': 'Skift til mørkt tema',
  'lang.label': 'Sprog',
  'footer.builtWith': 'Bygget med',
  'footer.hosted': 'og hostet på GitHub Pages.',
};

const ui: Record<Locale, Record<UiKey, string>> = { en, da };

/** Each language's own name, for the language switch. */
export const LANGUAGE_NAMES: Record<Locale, string> = { da: 'Dansk', en: 'English' };

/** Returns a lookup for interface text; pass `Astro.currentLocale`. */
export function useTranslations(locale: string | undefined) {
  const table = ui[toLocale(locale)];
  return (key: UiKey) => table[key];
}
