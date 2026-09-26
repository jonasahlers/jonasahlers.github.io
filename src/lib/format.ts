import type { YearMonth } from '../data/types';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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

function monthName(month: number): string {
  return MONTHS[month - 1]!;
}

// A no-break space keeps "Jun 2021" together when a narrow date column wraps.
function label({ year, month }: ParsedDate): string {
  return month === undefined ? `${year}` : `${monthName(month)}\u00a0${year}`;
}

/**
 * Formats a date range for display: "2021 — 2023", "Jun 2021 — Present",
 * "Jun — Aug 2022", or just "2022" when it starts and ends in the same year.
 */
export function formatPeriod(start: YearMonth, end?: YearMonth, separator = ' — '): string {
  const from = parse(start);
  if (end === undefined) return `${label(from)}${separator}Present`;

  const to = parse(end);
  if (to.year < from.year || (to.year === from.year && (to.month ?? 12) < (from.month ?? 1))) {
    throw new Error(`The period "${start}" to "${end}" ends before it starts.`);
  }
  if (from.year !== to.year) return `${label(from)}${separator}${label(to)}`;
  if (from.month === undefined || to.month === undefined) return `${from.year}`;
  if (from.month === to.month) return label(from);
  return `${monthName(from.month)}${separator}${label(to)}`;
}

/** "Jonas Ahlers" → "JA": the first letters of the first and last name. */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const picked = parts.length > 1 ? [parts[0]!, parts[parts.length - 1]!] : parts;
  return picked.map((part) => part.charAt(0).toUpperCase()).join('');
}
