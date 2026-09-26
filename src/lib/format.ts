import type { YearMonth } from '../data/types';
import type { Locale } from '../i18n/locales';

const MONTHS: Record<Locale, string[]> = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  da: ['jan.', 'feb.', 'mar.', 'apr.', 'maj', 'jun.', 'jul.', 'aug.', 'sep.', 'okt.', 'nov.', 'dec.'],
};
const PRESENT: Record<Locale, string> = { en: 'Present', da: 'nu' };

interface ParsedDate {
  year: number;
  month?: number;
}

function parse(value: string): ParsedDate {
  const match = /^(\d{4})(?:-(\d{2}))?$/.exec(value);
  const month = match?.[2] === undefined ? undefined : Number(match[2]);
  if (!match || (month !== undefined && (month < 1 || month > 12))) {
    throw new Error(`Invalid date "${value}": use "YYYY" or "YYYY-MM", e.g. "2023" or "2023-04".`);
  }
  return { year: Number(match[1]), month };
}

function monthName(month: number, locale: Locale): string {
  return MONTHS[locale][month - 1]!;
}

// A no-break space keeps "Jun 2021" together when a narrow date column wraps.
function label({ year, month }: ParsedDate, locale: Locale): string {
  return month === undefined ? `${year}` : `${monthName(month, locale)}\u00a0${year}`;
}

interface PeriodOptions {
  locale?: Locale;
  /** Between the two dates; screen-reader text uses a word such as " to ". */
  separator?: string;
}

/**
 * Formats a date range for display: "2021 — 2023", "Jun 2021 — Present",
 * "Jun — Aug 2022", or just "2022" when it starts and ends in the same year.
 */
export function formatPeriod(start: YearMonth, end?: YearMonth, options: PeriodOptions = {}): string {
  const { locale = 'en', separator = ' — ' } = options;
  const from = parse(start);
  if (end === undefined) return `${label(from, locale)}${separator}${PRESENT[locale]}`;

  const to = parse(end);
  if (to.year < from.year || (to.year === from.year && (to.month ?? 12) < (from.month ?? 1))) {
    throw new Error(`The period "${start}" to "${end}" ends before it starts.`);
  }
  if (from.year !== to.year) return `${label(from, locale)}${separator}${label(to, locale)}`;
  if (from.month === undefined || to.month === undefined) return `${from.year}`;
  if (from.month === to.month) return label(from, locale);
  return `${monthName(from.month, locale)}${separator}${label(to, locale)}`;
}

/** "Jonas Ahlers" → "JA": the first letters of the first and last name. */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const picked = parts.length > 1 ? [parts[0]!, parts[parts.length - 1]!] : parts;
  return picked.map((part) => part.charAt(0).toUpperCase()).join('');
}
