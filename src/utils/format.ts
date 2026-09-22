const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Format a "YYYY-MM" string as "Mon YYYY" (e.g. "2026-07" -> "Jul 2026").
 * Dates are stored as year-month strings in content so they sort naturally
 * and never depend on time zones.
 */
export function formatMonth(ym: string): string {
  const [y, m] = ym.split('-').map(Number);
  if (!y || !m || m < 1 || m > 12) return ym;
  return `${MONTHS[m - 1]} ${y}`;
}

/** "Jul 2026 — Present" or "Oct 2023 — Mar 2024". */
export function formatRange(start: string, end?: string | null): string {
  return `${formatMonth(start)} — ${end ? formatMonth(end) : 'Present'}`;
}

/** ISO date without time, e.g. "2026-09-06". */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Zero-padded two-digit index, e.g. 1 -> "01". */
export function pad2(n: number): string {
  return String(n).padStart(2, '0');
}
