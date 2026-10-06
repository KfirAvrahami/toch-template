/** SAP system ids per environment. */
export enum SapSystemId {
  Dev = 'DEV',
  Test = 'TST',
  Prod = 'PRD',
}

/** SAP clients per environment. */
export enum SapClient {
  Dev = 200,
  Test = 400,
  Prod = 400,
}

/** Logical environment, derived from `window.location.host`. */
export enum Environment {
  Local,
  Dev,
  Test,
  Prod,
}

/** Formats a Date as `yyyy-MM-dd` (no external date library). */
function formatIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parses a SAP OData date string into a Date.
 * `/Date(timestamp)/` => Date
 */
export function sapDateToJsDate(date: string | null): Date | null {
  const dateTimePattern = /\/Date\((\d{13,15})\)\//;
  const match = date?.match(dateTimePattern);
  return match && match[1] ? new Date(parseInt(match[1], 10)) : null;
}

/**
 * Formats a timestamp into the SAP OData date format.
 * timestamp => `/Date(timestamp)/`
 */
export function jsDateToSapDate(timestamp: number): string {
  return `/Date(${timestamp})/`;
}

/**
 * Formats a Date into the SAP OData `$filter` datetime literal.
 * date => `datetime'yyyy-MM-ddT00:00:00'`
 */
export function jsDateToSapDateFilter(date: Date): string {
  return `datetime'${formatIsoDate(date)}T00:00:00'`;
}

/** Picks the value for the current environment (from `window.location.host`). */
export function replaceByEnvironment<T>(options: { local: T; dev: T; test: T; prod: T }): T {
  const host = window.location.host;
  return host.includes('localhost')
    ? options.local
    : host.includes('dev')
    ? options.dev
    : host.includes('tst')
    ? options.test
    : options.prod;
}

/** Current environment name based on `window.location.host`. */
export function currentEnvironment(): 'local' | 'dev' | 'test' | 'prod' {
  const host = window.location.host;
  return host.includes('localhost')
    ? 'local'
    : host.includes('dev')
    ? 'dev'
    : host.includes('tst')
    ? 'test'
    : 'prod';
}

/** Current environment as the `Environment` enum. */
export function getEnvironment(): Environment {
  switch (currentEnvironment()) {
    case 'dev':
      return Environment.Dev;
    case 'test':
      return Environment.Test;
    case 'prod':
      return Environment.Prod;
    default:
      return Environment.Local;
  }
}

/** Opens a URL in a new tab without blocking the opener. */
export function openNewTab(url: string): void {
  window.open(url, '_blank', 'noreferrer');
}

/** Splits an array into chunks of at most `chunkSize` (default 500). */
export function splitArrayToChunks<T = unknown>(arr: T[], chunkSize = 500): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize));
  }
  return result;
}

/** Formats a Date as `DD/MM/YYYY` (e.g. for Excel export). */
export function formatDateForExcel(originalDate: Date | null): string {
  if (!originalDate) {
    return '';
  }
  const day = originalDate.getDate().toString().padStart(2, '0');
  const month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
  const year = originalDate.getFullYear();
  return `${day}/${month}/${year}`;
}

/** Formats a raw phone number to `XXX-XXXX-XXXX` (Israeli format, up to 11 digits). */
export function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  let formatted = '';
  if (digits.length > 0) {
    formatted += digits.slice(0, 3);
  }
  if (digits.length > 3) {
    formatted += '-' + digits.slice(3, 7);
  }
  if (digits.length > 7) {
    formatted += '-' + digits.slice(7, 11);
  }
  return formatted;
}
