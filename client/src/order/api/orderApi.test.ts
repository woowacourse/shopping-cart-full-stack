import {http, HttpResponse} from 'msw';

import {createOrder} from './orderApi.js';
import {ApiError} from '../../shared/api/requestApi.js';
import {mockServer} from '../../test/mockServer.js';

const API_BASE_URL = 'https://paradi-easter.up.railway.app';

describe('orderApi', () => {
  test('createOrder는 preorderId와 화면의 최종 결제 금액을 요청 body로 보낸다', async () => {
    let requestBody: unknown;

    mockServer.use(
      http.post(`${API_BASE_URL}/order`, async ({request}) => {
        requestBody = await request.json();

        return HttpResponse.json({body: {orderId: 'order-1'}}, {status: 201});
      })
    );

    await expect(
      createOrder({
        preorderId: 'preorder-1',
        expectedTotalPaymentAmount: 65000,
      })
    ).resolves.toEqual({orderId: 'order-1'});
    expect(requestBody).toEqual({
      preorderId: 'preorder-1',
      expectedTotalPaymentAmount: 65000,
    });
  });

  test('createOrder 실패 시 서버 에러 메시지와 상태 코드를 보존한다', async () => {
    mockServer.use(
      http.post(`${API_BASE_URL}/order`, () => {
        return HttpResponse.json(
          {
            body: {
              message: '서버에서 다시 계산한 결제 금액이 화면에 표시된 금액과 일치하지 않습니다.',
            },
          },
          {status: 409}
        );
      })
    );

    let thrownError: unknown;

    try {
      await createOrder({
        preorderId: 'preorder-1',
        expectedTotalPaymentAmount: 65000,
      });
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toBeInstanceOf(ApiError);
    expect((thrownError as Error).message).toBe(
      '서버에서 다시 계산한 결제 금액이 화면에 표시된 금액과 일치하지 않습니다.'
    );
    expect(thrownError).toMatchObject({status: 409});
  });
});
