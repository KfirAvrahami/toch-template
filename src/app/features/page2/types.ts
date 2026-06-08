export type Page2AdapterKind = 'mock' | 'api';

export interface Page2AdapterResult {
  adapter: Page2AdapterKind;
  title: string;
  subtitle: string;
  payload: unknown;
}

export interface Page2Adapter {
  getData(): import('rxjs').Observable<Page2AdapterResult>;
}

export interface Page2MockPayload {
  env: string;
  state: string;
  generatedAt: string;
  sapDate: string;
}
