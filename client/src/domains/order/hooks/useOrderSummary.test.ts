import {renderHook, waitFor} from '@testing-library/react';
import {http, HttpResponse} from 'msw';

import {useOrderSummary} from './useOrderSummary.js';
import {mockServer} from '../../../test/mockServer.js';

const API_BASE_URL = 'https://paradi-easter.up.railway.app';

describe('useOrderSummary', () => {
  test('orderId 기준으로 주문 요약 정보를 조회한다', async () => {
    mockServer.use(
      http.get(`${API_BASE_URL}/order/order-1`, () => {
        return HttpResponse.json({
          body: {
            itemCount: 1,
            totalQuantity: 2,
            totalAmount: 70000,
          },
        });
      })
    );

    const {result} = renderHook(() => useOrderSummary('order-1'));

    await waitFor(() => {
      expect(result.current.status).toBe('success');
    });

    expect(result.current.orderSummary).toEqual({
      itemCount: 1,
      totalQuantity: 2,
      totalAmount: 70000,
    });
    expect(result.current.errorMessage).toBe('');
  });

  test('orderId가 없으면 에러 상태로 변경한다', async () => {
    const {result} = renderHook(() => useOrderSummary(undefined));

    await waitFor(() => {
      expect(result.current.status).toBe('error');
    });

    expect(result.current.orderSummary).toBeNull();
    expect(result.current.errorMessage).toBe('주문 정보를 찾을 수 없습니다.');
  });

  test('주문 요약 조회에 실패하면 서버 에러 메시지를 사용한다', async () => {
    mockServer.use(
      http.get(`${API_BASE_URL}/order/order-1`, () => {
        return HttpResponse.json({body: {message: '주문 정보를 찾을 수 없습니다.'}}, {status: 404});
      })
    );

    const {result} = renderHook(() => useOrderSummary('order-1'));

    await waitFor(() => {
      expect(result.current.status).toBe('error');
    });

    expect(result.current.orderSummary).toBeNull();
    expect(result.current.errorMessage).toBe('주문 정보를 찾을 수 없습니다.');
  });
});
