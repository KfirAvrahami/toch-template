import { Injectable, InjectionToken, inject } from '@angular/core';

export enum LoggerType {
  Matomo = 'matomo',
  Console = 'console'
}

export interface LoggerAdapter {
  log(message: string, extra?: unknown): void;
  error(message: string, extra?: unknown): void;
}

export const LOGGER_TYPE = new InjectionToken<LoggerType>('LOGGER_TYPE', {
  providedIn: 'root',
  factory: () => LoggerType.Console
});

@Injectable({ providedIn: 'root' })
export class LoggerService {
  private readonly loggerType = inject(LOGGER_TYPE);

  log(message: string, extra?: unknown): void {
    if (this.loggerType === LoggerType.Console) {
      console.log('[app]', message, extra ?? '');
      return;
    }

    // Matomo-ready fallback placeholder.
    console.log('[matomo]', message, extra ?? '');
  }

  error(message: string, extra?: unknown): void {
    if (this.loggerType === LoggerType.Console) {
      console.error('[app]', message, extra ?? '');
      return;
    }

    console.error('[matomo]', message, extra ?? '');
  }
}
