import {http, HttpResponse} from 'msw';

import {previewOrder} from './orderPreviewApi.js';
import {mockServer} from '../../../test/mockServer.js';

const API_BASE_URL = 'https://paradi-easter.up.railway.app';

describe('orderPreviewApi', () => {
  test('previewOrder는 쿠폰과 배송 조건으로 결제 예상 금액을 요청한다', async () => {
    let requestBody: unknown;

    mockServer.use(
      http.post(`${API_BASE_URL}/order/preview`, async ({request}) => {
        requestBody = await request.json();

        return HttpResponse.json({
          body: {
            price: {
              orderAmount: 70000,
              productDiscountAmount: 5000,
              shippingDiscountAmount: 3000,
              totalDiscountAmount: 8000,
              shippingFee: 0,
              totalPaymentAmount: 65000,
            },
            appliedCoupons: [
              {
                couponId: 1,
                code: 'FIXED5000',
                name: '5,000원 할인 쿠폰',
                discountAmount: 5000,
              },
            ],
            excludedCoupons: [],
          },
        });
      })
    );

    await expect(
      previewOrder({
        preorderId: 'preorder-1',
        isRemoteArea: true,
        couponIds: [1],
      })
    ).resolves.toEqual({
      price: {
        orderAmount: 70000,
        productDiscountAmount: 5000,
        shippingDiscountAmount: 3000,
        totalDiscountAmount: 8000,
        shippingFee: 0,
        totalPaymentAmount: 65000,
      },
      appliedCoupons: [
        {
          couponId: 1,
          code: 'FIXED5000',
          name: '5,000원 할인 쿠폰',
          discountAmount: 5000,
        },
      ],
      excludedCoupons: [],
    });
    expect(requestBody).toEqual({
      preorderId: 'preorder-1',
      isRemoteArea: true,
      couponIds: [1],
    });
  });
});
