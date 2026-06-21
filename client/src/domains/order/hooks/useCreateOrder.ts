import {useCallback, useState} from 'react';

import {createOrder, type CreateOrderRequestBody, type CreateOrderResponse} from '../api/orderApi.js';

export function useCreateOrder() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const submitOrder = useCallback(
    async (body: CreateOrderRequestBody): Promise<CreateOrderResponse | null> => {
      if (isSubmitting) return null;

      setIsSubmitting(true);
      setErrorMessage('');

      try {
        return await createOrder(body);
      } catch (error) {
        setErrorMessage(getErrorMessage(error));

        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting]
  );

  return {
    errorMessage,
    isSubmitting,
    submitOrder,
  };
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;

  return '주문 요청에 실패했습니다.';
}
