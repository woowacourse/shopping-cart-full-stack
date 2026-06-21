import {renderHook, waitFor} from '@testing-library/react';
import {http, HttpResponse} from 'msw';

import {useOrderPreview} from './useOrderPreview.js';
import {mockServer} from '../../../test/mockServer.js';

const API_BASE_URL = 'https://paradi-easter.up.railway.app';
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function mockPreviewOrder() {
  mockServer.use(
    http.post(`${API_BASE_URL}/order/preview`, () => {
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
          appliedCoupons: [],
          excludedCoupons: [],
        },
      });
    })
  );
}

describe('useOrderPreview', () => {
  test('주문 미리보기 금액을 조회한다', async () => {
    mockPreviewOrder();

    const {result} = renderHook(() => useOrderPreview('preorder-1', false, [1, 3]));

    await waitFor(() => {
      expect(result.current.status).toBe('success');
    });

    expect(result.current.orderPreview?.price.totalPaymentAmount).toBe(65000);
    expect(result.current.errorMessage).toBe('');
    expect(result.current.errorType).toBe('default');
  });

  test('preorderId가 없으면 notFound 에러 타입으로 변경한다', async () => {
    const {result} = renderHook(() => useOrderPreview(undefined, false, []));

    await waitFor(() => {
      expect(result.current.status).toBe('error');
    });

    expect(result.current.orderPreview).toBeNull();
    expect(result.current.errorMessage).toBe('주문 확인 정보를 찾을 수 없습니다.');
    expect(result.current.errorType).toBe('notFound');
  });

  test('주문 확인 정보가 만료되면 expired 에러 타입으로 변경한다', async () => {
    mockServer.use(
      http.post(`${API_BASE_URL}/order/preview`, () => {
        return HttpResponse.json({body: {message: '주문 확인 시간이 만료되었습니다.'}}, {status: 410});
      })
    );

    const {result} = renderHook(() => useOrderPreview('preorder-1', false, []));

    await waitFor(() => {
      expect(result.current.status).toBe('error');
    });

    expect(result.current.errorMessage).toBe('주문 확인 시간이 만료되었습니다.');
    expect(result.current.errorType).toBe('expired');
  });

  test('이전 요청이 늦게 끝나도 최신 주문 미리보기 결과를 유지한다', async () => {
    mockServer.use(
      http.post(`${API_BASE_URL}/order/preview`, async ({request}) => {
        const requestBody = (await request.json()) as {couponIds: number[]};
        const hasCoupon = requestBody.couponIds.includes(1);

        if (hasCoupon) {
          await wait(50);
        }

        return HttpResponse.json({
          body: {
            price: {
              orderAmount: 70000,
              productDiscountAmount: hasCoupon ? 5000 : 0,
              shippingDiscountAmount: 0,
              totalDiscountAmount: hasCoupon ? 5000 : 0,
              shippingFee: 3000,
              totalPaymentAmount: hasCoupon ? 68000 : 73000,
            },
            appliedCoupons: [],
            excludedCoupons: [],
          },
        });
      })
    );

    const {result, rerender} = renderHook(
      ({couponIds}: {couponIds: number[]}) => useOrderPreview('preorder-1', false, couponIds),
      {
        initialProps: {
          couponIds: [1],
        },
      }
    );

    rerender({couponIds: []});

    await waitFor(() => {
      expect(result.current.orderPreview?.price.totalPaymentAmount).toBe(73000);
    });

    await wait(60);

    expect(result.current.orderPreview?.price.totalPaymentAmount).toBe(73000);
  });
});
