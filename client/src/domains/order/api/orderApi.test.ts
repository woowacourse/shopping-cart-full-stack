import {http, HttpResponse} from 'msw';

import {createOrder, getOrderSummary} from './orderApi.js';
import {ApiError} from '../../../shared/api/requestApi.js';
import {mockServer} from '../../../test/mockServer.js';

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

  test('getOrderSummary는 orderId로 주문 요약 정보를 요청한다', async () => {
    let requestedOrderId: string | null = null;

    mockServer.use(
      http.get(`${API_BASE_URL}/order/:orderId`, ({params}) => {
        requestedOrderId = params.orderId as string;

        return HttpResponse.json({
          body: {
            itemCount: 1,
            totalQuantity: 2,
            totalAmount: 70000,
          },
        });
      })
    );

    await expect(getOrderSummary('order-1')).resolves.toEqual({
      itemCount: 1,
      totalQuantity: 2,
      totalAmount: 70000,
    });
    expect(requestedOrderId).toBe('order-1');
  });
});
