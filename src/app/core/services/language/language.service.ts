import { DOCUMENT } from '@angular/common';
import { Injectable, LOCALE_ID, inject } from '@angular/core';
import { environment } from '../../environments/environment';

/** A UI language the user can pick. */
export interface AppLanguage {
  /** Locale id, matching `assets/i18n/<code>.json` (none for 'en', the source locale). */
  code: string;
  /** Short label for the picker, in its own language. */
  label: string;
}

/** localStorage key read by `main.ts` to pick the locale before bootstrap. */
export const LOCALE_STORAGE_KEY = 'app.locale';

/** Every locale the build can run in, including deployment flavors such as 'he-balmas'. */
export const SUPPORTED_LOCALES: ReadonlyArray<string> = ['en', 'he', 'he-balmas'];

/**
 * Switches the UI language at runtime. One build serves every locale; `$localize` resolves each
 * message when its view is created, so switching persists the choice and reloads once.
 */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly document = inject(DOCUMENT);

  /** The active locale id. */
  readonly current = inject(LOCALE_ID);

  /**
   * Languages offered in a picker. A deployment flavor ('he-balmas') is not a separate choice: it is
   * set through `environment.defaultLocale`, and the Hebrew entry then uses that flavor.
   */
  readonly languages: ReadonlyArray<AppLanguage> = [
    { code: 'en', label: 'EN' },
    { code: environment.defaultLocale.startsWith('he') ? environment.defaultLocale : 'he', label: 'עברית' }
  ];

  /** Persists the chosen locale and reloads so runtime translations re-initialize. */
  switchTo(code: string): void {
    const view = this.document.defaultView;
    if (!view || code === this.current || !SUPPORTED_LOCALES.includes(code)) {
      return;
    }
    try {
      view.localStorage.setItem(LOCALE_STORAGE_KEY, code);
    } catch {
      // Storage unavailable — reload anyway; the choice just won't persist.
    }
    view.location.reload();
  }
}
