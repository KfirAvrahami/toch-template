import { inject, Injectable, signal } from '@angular/core';
import { AUTH_PROVIDER, AuthUser } from './adapters/interface';

@Injectable()
export class AuthService {
  private readonly activeAdapter = inject(AUTH_PROVIDER);
  private readonly user = signal<AuthUser>(this.activeAdapter.getUser());

  getCurrentUser() {
    return this.user.asReadonly();
  }
}
