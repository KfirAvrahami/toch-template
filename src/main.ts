import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

const locale = typeof $localize !== 'undefined' && $localize.locale ? $localize.locale : 'en';
const isRtl = locale.toLowerCase().startsWith('he');

document.documentElement.lang = locale;
document.documentElement.dir = isRtl ? 'rtl' : 'ltr';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
