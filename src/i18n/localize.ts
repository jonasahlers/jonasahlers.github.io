import { LOCALES, type Locale } from './locales.ts';

/** A string written once per language. */
export type Translation = Record<Locale, string>;

/**
 * T with every string optionally replaced by a translation. Plain strings are shared by all
 * languages (names, URLs, dates, most tech tags); only text that differs needs `{ da, en }`.
 */
export type Localized<T> = T extends ImageMetadata
  ? T
  : T extends string
    ? T | Translation
    : T extends readonly (infer Item)[]
      ? Localized<Item>[]
      : T extends object
        ? { [K in keyof T]: Localized<T[K]> }
        : T;

function isTranslation(value: object): value is Translation {
  const keys = Object.keys(value);
  return keys.length === LOCALES.length && LOCALES.every((locale) => typeof (value as Translation)[locale] === 'string');
}

// Imported images (src, width, height, format) are data, not text: pass them through untouched.
function isImage(value: object): boolean {
  return 'src' in value && 'format' in value;
}

/** Resolves every translation in a value to the given locale. */
export function localize<T>(value: Localized<T>, locale: Locale): T {
  if (Array.isArray(value)) return value.map((item) => localize(item, locale)) as T;
  if (typeof value !== 'object' || value === null || isImage(value)) return value as T;
  if (isTranslation(value)) return value[locale] as T;
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, localize(item, locale)])) as T;
}
