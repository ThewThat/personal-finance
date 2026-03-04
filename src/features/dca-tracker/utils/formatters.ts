/**
 * Format a number with locale separators.
 */
export function fmt(n: number | null | undefined, d = 2): string {
  return n != null
    ? n.toLocaleString("en-US", {
        minimumFractionDigits: d,
        maximumFractionDigits: d,
      })
    : "—";
}

/**
 * Format as USD string.
 */
export function fU(n: number | null | undefined): string {
  return `$${fmt(n)}`;
}

/**
 * Format large numbers with B/M/T suffix.
 */
export function fB(n: number | null | undefined): string {
  if (n == null) return "—";
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  return fU(n);
}
