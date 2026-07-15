/**
 * Parses a SAP timestamp string to a Date.
 * Returns undefined for invalid or empty input.
 * Prefer using parseSAPDate from @toch/sap-utils for OData /Date(timestamp)/ strings.
 */
export function parseSapTimestamp(value: string): Date | undefined {
  if (!value) return undefined;
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? undefined : parsed;
}

/**
 * Formats a SAP time string for display.
 * Returns empty string for empty input.
 */
export function parseSapTime(value: string): string {
  return value ?? '';
}
