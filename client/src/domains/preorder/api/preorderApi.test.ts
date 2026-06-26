import {http, HttpResponse} from 'msw';

import {createPreorder, getPreorder} from './preorderApi.js';
import {ApiError} from '../../../shared/api/requestApi.js';
import {mockServer} from '../../../test/mockServer.js';

const API_BASE_URL = 'https://paradi-easter.up.railway.app';

describe('preorderApi', () => {
  test('createPreorder는 선택한 장바구니 id를 요청 body로 보낸다', async () => {
    let requestBody: unknown;

    mockServer.use(
      http.post(`${API_BASE_URL}/preorder`, async ({request}) => {
        requestBody = await request.json();

        return HttpResponse.json({body: {preorderId: 'preorder-1'}}, {status: 201});
      })
    );

    await expect(createPreorder(['cart-1', 'cart-2'])).resolves.toEqual({preorderId: 'preorder-1'});
    expect(requestBody).toEqual({selectedCartIds: ['cart-1', 'cart-2']});
  });

  test('getPreorder는 preorderId로 주문 확인 정보를 요청한다', async () => {
    let requestedPreorderId: string | null = null;

    mockServer.use(
      http.get(`${API_BASE_URL}/preorder/:preorderId`, ({params}) => {
        requestedPreorderId = params.preorderId as string;

        return HttpResponse.json({
          body: {
            preorderId: 'preorder-1',
            items: [
              {
                productId: 'product-1',
                price: 35000,
                name: '상품이름A',
                imageUrl: '/product-a.png',
                quantity: 2,
              },
            ],
          },
        });
      })
    );

    await expect(getPreorder('preorder-1')).resolves.toEqual({
      preorderId: 'preorder-1',
      items: [
        {
          productId: 'product-1',
          price: 35000,
          name: '상품이름A',
          imageUrl: '/product-a.png',
          quantity: 2,
        },
      ],
    });
    expect(requestedPreorderId).toBe('preorder-1');
  });

  test('getPreorder 실패 시 응답 상태 코드를 보존한다', async () => {
    mockServer.use(
      http.get(`${API_BASE_URL}/preorder/preorder-1`, () => {
        return HttpResponse.json({body: {message: '주문 확인 시간이 만료되었습니다.'}}, {status: 410});
      })
    );

    let thrownError: unknown;

    try {
      await getPreorder('preorder-1');
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toBeInstanceOf(ApiError);
    expect((thrownError as Error).message).toBe('주문 확인 시간이 만료되었습니다.');
    expect(thrownError).toMatchObject({status: 410});
  });
});
