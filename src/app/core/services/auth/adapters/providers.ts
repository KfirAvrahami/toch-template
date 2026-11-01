import { Provider } from '@angular/core';
import { AuthService } from '../auth.service';
import { AUTH_PROVIDER } from './interface';
import { MockAuthAdapter } from './api/adapter.mock';
import { SsoAuthAdapter } from './api/adapter.sso';

export namespace AuthProviders {
  export const Mock: Provider[] = [
    AuthService,
    MockAuthAdapter,
    { provide: AUTH_PROVIDER, useClass: MockAuthAdapter }
  ];

  export const Sso: Provider[] = [
    AuthService,
    SsoAuthAdapter,
    { provide: AUTH_PROVIDER, useClass: SsoAuthAdapter }
  ];
}
