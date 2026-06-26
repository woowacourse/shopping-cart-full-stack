import {jest} from '@jest/globals';

import {HttpError, errorHandler} from '../errorHandler.js';

const createResponse = () => {
  return {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    json: jest.fn(),
  };
};

describe('errorHandler', () => {
  test('HttpError 메시지가 있으면 상태 코드와 메시지를 응답한다', () => {
    const response = createResponse();

    errorHandler(new HttpError(404, '찾을 수 없습니다.'), {} as never, response as never, jest.fn());

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith({
      body: {
        message: '찾을 수 없습니다.',
      },
    });
  });

  test('HttpError 메시지가 없으면 상태 코드만 응답한다', () => {
    const response = createResponse();

    errorHandler(new HttpError(204), {} as never, response as never, jest.fn());

    expect(response.status).toHaveBeenCalledWith(204);
    expect(response.send).toHaveBeenCalled();
  });

  test('HttpError가 아니면 500으로 응답한다', () => {
    const response = createResponse();

    errorHandler(new Error('예상하지 못한 오류'), {} as never, response as never, jest.fn());

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.send).toHaveBeenCalled();
  });
});
