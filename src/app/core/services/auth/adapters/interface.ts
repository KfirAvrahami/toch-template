import { InjectionToken } from '@angular/core';

export interface AuthUser {
  displayName: string;
  personalNumber: string;
  state: string;
  status: number;
  bob: string;
}

export interface AuthAdapter {
  getUser(): AuthUser;
}

export const AUTH_PROVIDER = new InjectionToken<AuthAdapter>('AuthProvider');
