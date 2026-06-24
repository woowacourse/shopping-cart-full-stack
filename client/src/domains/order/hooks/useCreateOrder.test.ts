import {act, renderHook, waitFor} from '@testing-library/react';
import {http, HttpResponse} from 'msw';

import {useCreateOrder} from './useCreateOrder.js';
import {mockServer} from '../../../test/mockServer.js';

const API_BASE_URL = 'https://paradi-easter.up.railway.app';

const createOrderBody = {
  preorderId: 'preorder-1',
  expectedTotalPaymentAmount: 70000,
};

describe('useCreateOrder', () => {
  test('주문 생성에 성공하면 orderId를 반환한다', async () => {
    mockServer.use(
      http.post(`${API_BASE_URL}/order`, () => {
        return HttpResponse.json({body: {orderId: 'order-1'}}, {status: 201});
      })
    );
    const {result} = renderHook(() => useCreateOrder());

    await expect(result.current.submitOrder(createOrderBody)).resolves.toEqual({
      status: 'success',
      order: {orderId: 'order-1'},
    });

    await waitFor(() => {
      expect(result.current.isSubmitting).toBe(false);
    });
    expect(result.current.errorMessage).toBe('');
  });

  test('주문 생성에 실패하면 null을 반환하고 에러 메시지를 저장한다', async () => {
    mockServer.use(
      http.post(`${API_BASE_URL}/order`, () => {
        return HttpResponse.json({body: {message: '결제 금액이 일치하지 않습니다.'}}, {status: 409});
      })
    );
    const {result} = renderHook(() => useCreateOrder());

    await expect(result.current.submitOrder(createOrderBody)).resolves.toEqual({
      status: 'error',
      error: {
        message: '결제 금액이 일치하지 않습니다.',
        status: 409,
      },
    });

    await waitFor(() => {
      expect(result.current.error).toEqual({
        message: '결제 금액이 일치하지 않습니다.',
        status: 409,
      });
      expect(result.current.errorMessage).toBe('결제 금액이 일치하지 않습니다.');
    });
    expect(result.current.isSubmitting).toBe(false);
  });

  test('주문 생성 요청 중이면 중복 요청을 보내지 않는다', async () => {
    const requestBodies: unknown[] = [];
    let resolveOrder: (() => void) | undefined;
    mockServer.use(
      http.post(`${API_BASE_URL}/order`, async ({request}) => {
        requestBodies.push(await request.json());

        return new Promise((resolve) => {
          resolveOrder = () => resolve(HttpResponse.json({body: {orderId: 'order-1'}}, {status: 201}));
        });
      })
    );
    const {result} = renderHook(() => useCreateOrder());

    const submitPromise = result.current.submitOrder(createOrderBody);

    await waitFor(() => {
      expect(result.current.isSubmitting).toBe(true);
    });

    await expect(result.current.submitOrder(createOrderBody)).resolves.toBeNull();
    expect(requestBodies).toHaveLength(1);

    act(() => {
      resolveOrder?.();
    });

    await expect(submitPromise).resolves.toEqual({
      status: 'success',
      order: {orderId: 'order-1'},
    });
    await waitFor(() => {
      expect(result.current.isSubmitting).toBe(false);
    });
  });
});
