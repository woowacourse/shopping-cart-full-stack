import { useState } from 'react';
import { ApiError } from '../../api/errors/ApiError';

export const useMutation = <TVariables, TData>(
  mutationFn: (variables: TVariables) => Promise<TData>,
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (
    variables: TVariables,
    options?: {
      onMutate?: () => void;
      onSuccess?: (data: TData) => void;
      onError?: (error: Error) => void;
    },
  ) => {
    setIsLoading(true);
    setError(null);

    // 요청 직전 실행 (필요 시)
    options?.onMutate?.();

    try {
      const result = await mutationFn(variables);
      options?.onSuccess?.(result);
      return result;
    } catch (error) {
      const nextError = createError(error);
      setError(nextError);

      // 에러 발생 시 onError 콜백을 통해 컴포넌트에 알림
      options?.onError?.(nextError);
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, error };
};

const createError = (error: unknown) => {
  if (error instanceof ApiError) return error;

  return new Error('요청 처리 중 오류가 발생했습니다.');
};
