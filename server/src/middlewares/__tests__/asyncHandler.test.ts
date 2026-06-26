import {jest} from '@jest/globals';

import {asyncHandler} from '../asyncHandler.js';

describe('asyncHandler', () => {
  test('비동기 핸들러가 실패하면 next로 에러를 전달한다', async () => {
    const error = new Error('실패');
    const next = jest.fn();
    const handler = asyncHandler(async () => {
      throw error;
    });

    await handler({} as never, {} as never, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  test('동기 핸들러가 실패해도 next로 에러를 전달한다', async () => {
    const error = new Error('실패');
    const next = jest.fn();
    const handler = asyncHandler(() => {
      throw error;
    });

    await handler({} as never, {} as never, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
