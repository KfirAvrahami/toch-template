import { InjectionToken, Provider } from '@angular/core';
import { PAGE2_API_PROVIDER } from './interface';
import { Page2ApiAdapter } from './api/adapter.sap';
import { Page2MockAdapter } from './api/adapter.mock';
import { Page2Service } from '../services/page2.service';

export namespace Page2ApiProviders {
  export const Api: Provider[] = [
    Page2Service,
    Page2ApiAdapter,
    { provide: PAGE2_API_PROVIDER, useClass: Page2ApiAdapter }
  ];

  export const Mock: Provider[] = [
    Page2Service,
    Page2MockAdapter,
    { provide: PAGE2_API_PROVIDER, useClass: Page2MockAdapter }
  ];
}
