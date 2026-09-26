export const LOCALES = ['da', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'da';

/** Narrows Astro.currentLocale (or any string) to a supported locale, defaulting to Danish. */
export function toLocale(value: string | undefined): Locale {
  return LOCALES.find((locale) => locale === value) ?? DEFAULT_LOCALE;
}
