import {http, HttpResponse} from 'msw';

import {createPreorder} from './orderApi.js';
import {mockServer} from '../../test/mockServer.js';

const API_BASE_URL = 'https://paradi-easter.up.railway.app';

describe('orderApi', () => {
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
});
