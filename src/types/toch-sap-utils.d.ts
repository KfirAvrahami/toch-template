declare module '@toch/sap-utils/dist/sap-odata/formatters' {
  export function formatSapMessage(message: {
    code: string;
    message: string;
    severity: string;
    details?: Array<{ code: string; message: string; severity: string }>;
  }): { code: string; message: string; severity: string };
}

declare module '@toch/sap-utils/dist/sap-odata/formatters.js' {
  export function formatSapMessage(message: {
    code: string;
    message: string;
    severity: string;
    details?: Array<{ code: string; message: string; severity: string }>;
  }): { code: string; message: string; severity: string };
}

declare module '@toch/sap-utils/dist/sap-odata/parser' {
  export function parseDateForSAP(timestamp: Date | number | null | undefined): string | null;
  export function parseSAPDate(date: string | null | undefined): Date | null;
}

declare module '@toch/sap-utils/dist/sap-odata/parser.js' {
  export function parseDateForSAP(timestamp: Date | number | null | undefined): string | null;
  export function parseSAPDate(date: string | null | undefined): Date | null;
}
