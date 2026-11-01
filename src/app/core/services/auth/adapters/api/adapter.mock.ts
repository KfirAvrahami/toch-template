import { Injectable } from '@angular/core';
import { AuthAdapter, AuthUser } from '../interface';

@Injectable()
export class MockAuthAdapter implements AuthAdapter {
  getUser(): AuthUser {
    return {
      displayName: 'ישראל ישראלי',
      personalNumber: '123456789',
      state: 'authenticated',
      status: 200,
      bob: 'mock-bob'
    };
  }
}
