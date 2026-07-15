import { Page2AdapterResult } from '../../types';

export const PAGE2_MOCK_RESULT: Page2AdapterResult = {
  adapter: 'mock',
  title: 'Mock adapter response',
  subtitle: 'Local hardcoded payload',
  payload: {
    env: 'local',
    state: 'ok',
    generatedAt: new Date().toISOString(),
    sapDate: '/Date(1742985000000)/'
  }
};
