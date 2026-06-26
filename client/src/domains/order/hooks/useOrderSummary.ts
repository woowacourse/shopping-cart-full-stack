import {useCallback, useEffect, useState} from 'react';

import {getOrderSummary, type OrderSummary} from '../api/orderApi.js';

export type OrderSummaryStatus = 'loading' | 'success' | 'error';

export function useOrderSummary(orderId: string | undefined) {
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const loadOrderSummary = useCallback(async () => {
    if (!orderId) {
      setOrderSummary(null);
      setErrorMessage('주문 정보를 찾을 수 없습니다.');
      return;
    }

    setOrderSummary(null);
    setErrorMessage('');

    try {
      const orderSummary = await getOrderSummary(orderId);

      setOrderSummary(orderSummary);
    } catch (error) {
      setOrderSummary(null);
      setErrorMessage(getErrorMessage(error));
    }
  }, [orderId]);

  useEffect(() => {
    void loadOrderSummary();
  }, [loadOrderSummary]);

  return {
    errorMessage,
    loadOrderSummary,
    orderSummary,
    status: getOrderSummaryStatus(orderSummary, errorMessage),
  };
}

function getOrderSummaryStatus(orderSummary: OrderSummary | null, errorMessage: string): OrderSummaryStatus {
  if (errorMessage) return 'error';
  if (orderSummary) return 'success';

  return 'loading';
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;

  return '주문 정보를 불러오지 못했습니다.';
}
