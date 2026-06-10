import '@testing-library/jest-dom';

import {mockServer} from './test/mockServer.js';

beforeAll(() => {
  mockServer.listen({onUnhandledRequest: 'error'});
});

afterEach(() => {
  mockServer.resetHandlers();
});

afterAll(() => {
  mockServer.close();
});
