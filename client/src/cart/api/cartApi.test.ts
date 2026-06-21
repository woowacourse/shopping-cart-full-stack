import {http, HttpResponse} from 'msw';

import {getCartItems, updateCartItemQuantity} from './cartApi.js';
import {mockServer} from '../../test/mockServer.js';

const API_BASE_URL = 'https://paradi-easter.up.railway.app';

describe('cartApi', () => {
  test('updateCartItemQuantity는 변경할 수량을 요청 body로 보낸다', async () => {
    let requestBody: unknown;

    mockServer.use(
      http.patch(`${API_BASE_URL}/carts/cart-1`, async ({request}) => {
        requestBody = await request.json();

        return HttpResponse.json({body: {id: 'cart-1', quantity: 3}});
      })
    );

    await expect(updateCartItemQuantity('cart-1', 3)).resolves.toEqual({id: 'cart-1', quantity: 3});
    expect(requestBody).toEqual({quantity: 3});
  });

  test('에러 응답 메시지를 Error로 전달한다', async () => {
    mockServer.use(
      http.patch(`${API_BASE_URL}/carts/cart-1`, () => {
        return HttpResponse.json({body: {message: '수량은 1 이상 99 이하의 정수여야 합니다.'}}, {status: 400});
      })
    );

    await expect(updateCartItemQuantity('cart-1', 100)).rejects.toThrow('수량은 1 이상 99 이하의 정수여야 합니다.');
  });

  test('에러 응답 메시지가 없으면 기본 Error 메시지를 전달한다', async () => {
    mockServer.use(
      http.get(`${API_BASE_URL}/carts`, () => {
        return HttpResponse.json({body: {}}, {status: 500});
      })
    );

    await expect(getCartItems()).rejects.toThrow('요청에 실패했습니다.');
  });

  test('에러 응답을 파싱할 수 없으면 기본 Error 메시지를 전달한다', async () => {
    mockServer.use(
      http.get(`${API_BASE_URL}/carts`, () => {
        return new HttpResponse('Invalid JSON', {status: 500});
      })
    );

    await expect(getCartItems()).rejects.toThrow('요청에 실패했습니다.');
  });
});
