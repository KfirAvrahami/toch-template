import { registerLocaleData } from '@angular/common';
import localeHe from '@angular/common/locales/he';
import { LOCALE_ID } from '@angular/core';
import { loadTranslations } from '@angular/localize';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { environment } from './app/core/environments/environment';
import { LOCALE_STORAGE_KEY, SUPPORTED_LOCALES } from './app/core/services/language/language.service';

/**
 * Runtime i18n: ONE build serves every locale. The active locale is the user's stored choice, else
 * `environment.defaultLocale`. Its translation file is loaded into `$localize` BEFORE bootstrap, and
 * switching language persists the choice and reloads (see LanguageService). English is the source
 * locale, so its strings are the template defaults and need no translation file.
 */
function resolveLocale(): string {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored !== null && SUPPORTED_LOCALES.includes(stored)) {
      return stored;
    }
  } catch {
    // Storage unavailable — fall through to the deployment default.
  }
  return environment.defaultLocale;
}

async function loadLocale(locale: string): Promise<void> {
  if (locale !== 'en') {
    try {
      const response = await fetch(`assets/i18n/${locale}.json`);
      const data = (await response.json()) as { translations?: Record<string, string> };
      if (data.translations) {
        loadTranslations(data.translations);
      }
    } catch (err) {
      console.error(`Failed to load "${locale}" translations; falling back to source text.`, err);
    }
  }
  $localize.locale = locale;
}

const locale = resolveLocale();
const isHebrew = locale.toLowerCase().startsWith('he');
if (isHebrew) {
  // Register under the exact id too, so pipes work for variants such as 'he-balmas'.
  registerLocaleData(localeHe, locale);
}

document.documentElement.lang = locale;
document.documentElement.dir = isHebrew ? 'rtl' : 'ltr';

loadLocale(locale)
  .then(() =>
    bootstrapApplication(App, {
      ...appConfig,
      providers: [...appConfig.providers, { provide: LOCALE_ID, useValue: locale }]
    })
  )
  .catch((err) => console.error(err));
