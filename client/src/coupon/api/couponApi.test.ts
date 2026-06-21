import {http, HttpResponse} from 'msw';

import {getCoupons} from './couponApi.js';
import {mockServer} from '../../test/mockServer.js';

const API_BASE_URL = 'https://paradi-easter.up.railway.app';

describe('couponApi', () => {
  test('getCoupons는 preorderId로 사용 가능한 쿠폰 목록을 요청한다', async () => {
    let requestedPreorderId: string | null = null;

    mockServer.use(
      http.get(`${API_BASE_URL}/coupons`, ({request}) => {
        const url = new URL(request.url);
        requestedPreorderId = url.searchParams.get('preorderId');

        return HttpResponse.json({
          body: {
            coupons: [
              {
                couponId: 1,
                code: 'FIXED5000',
                name: '5000원 할인 쿠폰',
                expirationDate: '2026-11-30T14:59:59.000Z',
                condition: {
                  description: '최소 주문 금액: 100,000원',
                },
                disabled: false,
                disabledReason: null,
              },
            ],
          },
        });
      })
    );

    await expect(getCoupons('preorder-1')).resolves.toEqual([
      {
        couponId: 1,
        code: 'FIXED5000',
        name: '5000원 할인 쿠폰',
        expirationDate: '2026-11-30T14:59:59.000Z',
        condition: {
          description: '최소 주문 금액: 100,000원',
        },
        disabled: false,
        disabledReason: null,
      },
    ]);
    expect(requestedPreorderId).toBe('preorder-1');
  });

  test('getCoupons 실패 시 쿠폰 기본 에러 메시지를 전달한다', async () => {
    mockServer.use(
      http.get(`${API_BASE_URL}/coupons`, () => {
        return HttpResponse.text('', {status: 500});
      })
    );

    await expect(getCoupons('preorder-1')).rejects.toThrow('쿠폰 요청에 실패했습니다.');
  });
});
