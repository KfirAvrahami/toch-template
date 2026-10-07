import { Injectable } from '@angular/core';
import { AuthAdapter, AuthUser } from '../interface';

@Injectable()
export class SsoAuthAdapter implements AuthAdapter {
  getUser(): AuthUser {
    throw new Error('SSO adapter is not implemented yet.');
  }
}
