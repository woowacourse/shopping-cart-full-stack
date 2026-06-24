import {useCallback, useState} from 'react';

import {ApiError} from '../../../shared/api/requestApi.js';
import {createOrder, type CreateOrderRequestBody, type CreateOrderResponse} from '../api/orderApi.js';

export type CreateOrderError = {
  message: string;
  status: number | null;
};

export type CreateOrderResult =
  | {
      status: 'success';
      order: CreateOrderResponse;
    }
  | {
      status: 'error';
      error: CreateOrderError;
    };

export function useCreateOrder() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<CreateOrderError | null>(null);

  const submitOrder = useCallback(
    async (body: CreateOrderRequestBody): Promise<CreateOrderResult | null> => {
      if (isSubmitting) return null;

      setIsSubmitting(true);
      setError(null);

      try {
        const order = await createOrder(body);

        return {
          status: 'success',
          order,
        };
      } catch (requestError) {
        const error = getCreateOrderError(requestError);

        setError(error);

        return {
          status: 'error',
          error,
        };
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting]
  );

  return {
    error,
    errorMessage: error?.message ?? '',
    isSubmitting,
    submitOrder,
  };
}

function getCreateOrderError(error: unknown): CreateOrderError {
  if (error instanceof ApiError) {
    return {
      message: error.message,
      status: error.status,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      status: null,
    };
  }

  return {
    message: '주문 요청에 실패했습니다.',
    status: null,
  };
}
