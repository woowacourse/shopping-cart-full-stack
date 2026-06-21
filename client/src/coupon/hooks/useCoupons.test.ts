import {renderHook, waitFor} from '@testing-library/react';
import {http, HttpResponse} from 'msw';

import {useCoupons} from './useCoupons.js';
import {mockServer} from '../../test/mockServer.js';

const API_BASE_URL = 'https://paradi-easter.up.railway.app';

const coupons = [
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
];

function mockGetCoupons() {
  mockServer.use(
    http.get(`${API_BASE_URL}/coupons`, () => {
      return HttpResponse.json({
        body: {
          coupons,
          recommendedCouponIds: [1],
        },
      });
    })
  );
}

describe('useCoupons', () => {
  test('preorderId 기준으로 쿠폰 목록을 조회한다', async () => {
    mockGetCoupons();

    const {result} = renderHook(() => useCoupons('preorder-1', false));

    await waitFor(() => {
      expect(result.current.status).toBe('success');
    });

    expect(result.current.coupons).toEqual(coupons);
    expect(result.current.recommendedCouponIds).toEqual([1]);
    expect(result.current.errorMessage).toBe('');
  });

  test('preorderId가 없으면 에러 상태로 변경한다', async () => {
    const {result} = renderHook(() => useCoupons(undefined, false));

    await waitFor(() => {
      expect(result.current.status).toBe('error');
    });

    expect(result.current.coupons).toEqual([]);
    expect(result.current.recommendedCouponIds).toEqual([]);
    expect(result.current.errorMessage).toBe('쿠폰 정보를 불러올 수 없습니다.');
  });

  test('쿠폰 목록이 비어 있어도 조회에 성공하면 성공 상태로 변경한다', async () => {
    mockServer.use(
      http.get(`${API_BASE_URL}/coupons`, () => {
        return HttpResponse.json({
          body: {
            coupons: [],
            recommendedCouponIds: [],
          },
        });
      })
    );

    const {result} = renderHook(() => useCoupons('preorder-1', false));

    await waitFor(() => {
      expect(result.current.status).toBe('success');
    });

    expect(result.current.coupons).toEqual([]);
    expect(result.current.recommendedCouponIds).toEqual([]);
    expect(result.current.errorMessage).toBe('');
  });

  test('쿠폰 조회에 실패하면 에러 상태로 변경한다', async () => {
    mockServer.use(
      http.get(`${API_BASE_URL}/coupons`, () => {
        return HttpResponse.json({body: {message: '쿠폰 정보를 불러오지 못했습니다.'}}, {status: 500});
      })
    );

    const {result} = renderHook(() => useCoupons('preorder-1', false));

    await waitFor(() => {
      expect(result.current.status).toBe('error');
    });

    expect(result.current.coupons).toEqual([]);
    expect(result.current.recommendedCouponIds).toEqual([]);
    expect(result.current.errorMessage).toBe('쿠폰 정보를 불러오지 못했습니다.');
  });
});
