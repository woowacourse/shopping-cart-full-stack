import {ApiError, requestApi, requestApiWithoutBody} from './requestApi.js';

const API_BASE_URL = 'https://paradi-easter.up.railway.app';

afterEach(() => {
  jest.restoreAllMocks();
});

describe('requestApi', () => {
  test('응답 body를 반환하고 기본 Content-Type 헤더를 포함한다', async () => {
    const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
      Response.json({
        body: {
          id: 1,
        },
      })
    );

    await expect(requestApi('/products')).resolves.toEqual({id: 1});
    expect(fetchSpy).toHaveBeenCalledWith(`${API_BASE_URL}/products`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  test('요청 옵션과 헤더를 함께 전달한다', async () => {
    const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
      Response.json({
        body: {
          ok: true,
        },
      })
    );

    await requestApi('/orders', {
      method: 'POST',
      body: JSON.stringify({id: 1}),
      headers: {
        Authorization: 'Bearer token',
      },
    });

    expect(fetchSpy).toHaveBeenCalledWith(`${API_BASE_URL}/orders`, {
      method: 'POST',
      body: JSON.stringify({id: 1}),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token',
      },
    });
  });

  test('응답 body가 없는 성공 요청을 처리한다', async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, {status: 204}));

    await expect(requestApiWithoutBody('/orders/order-1')).resolves.toBeUndefined();
  });

  test('실패 응답이면 서버 메시지와 상태 코드를 가진 ApiError를 던진다', async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValue(
      Response.json(
        {
          body: {
            message: '요청 값이 올바르지 않습니다.',
          },
        },
        {status: 400}
      )
    );

    await expect(requestApi('/orders')).rejects.toMatchObject({
      message: '요청 값이 올바르지 않습니다.',
      status: 400,
    } satisfies Partial<ApiError>);
  });

  test('실패 응답 메시지를 파싱할 수 없으면 기본 에러 메시지를 사용한다', async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('not json', {status: 500}));

    await expect(requestApi('/orders', {errorMessage: '주문 요청 실패'})).rejects.toMatchObject({
      message: '주문 요청 실패',
      status: 500,
    } satisfies Partial<ApiError>);
  });
});
