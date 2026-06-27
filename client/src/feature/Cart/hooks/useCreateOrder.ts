import { useState } from 'react';
import type {
  PostOrderRequest,
  PostOrderResponse,
} from '../../../api/orderDraft/orderApi.types';
import { postOrder } from '../../../api/orderDraft/orderApi';
import { useMutation } from '../../../shared/hooks/useMutation';

export const useCreateOrder = () => {
  const [error, setError] = useState<Error | null>(null);

  const { mutate, isLoading } = useMutation<
    PostOrderRequest,
    PostOrderResponse
  >(postOrder);

  const createOrder = async (request: PostOrderRequest) => {
    return mutate(request, {
      onMutate: () => {
        setError(null);
      },

      onError: (nextError) => {
        setError(nextError);
      },
    });
  };

  return {
    createOrder,
    isCreating: isLoading,
    error,
  };
};
