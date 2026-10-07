import { APP_INITIALIZER, ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { cacheInterceptor } from './core/interceptors/cache.interceptor';
import { AuthProviders } from './core/services/auth/adapters/providers';
import { IconRegistryService } from './core/services/icon-registry.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimations(),
    // Hash URLs: a static host (SAP BSP) cannot rewrite deep links; see [BUILD-DEPLOY] in STANDARDS.md.
    provideRouter(routes, withHashLocation()),
    provideHttpClient(withInterceptors([cacheInterceptor])),
    ...AuthProviders.Mock,
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (iconRegistry: IconRegistryService) => () => iconRegistry.registerIcons(),
      deps: [IconRegistryService]
    }
  ]
};
