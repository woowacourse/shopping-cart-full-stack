import { useCallback, useState } from 'react';

type MutateOptions<TData> = {
  onSuccess?: (data: TData) => void | Promise<void>;
  onError?: (error: Error) => void | Promise<void>;
};

export type Mutate = <TData>(
  mutationFn: () => Promise<TData>,
  options?: MutateOptions<TData>,
) => Promise<TData>;

type UseMutationResult = {
  mutate: Mutate;
  isPending: boolean;
  error: Error | null;
};

export function useMutation(): UseMutationResult {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate: Mutate = useCallback(
    async <TData>(
      mutationFn: () => Promise<TData>,
      options: MutateOptions<TData> = {},
    ) => {
      setIsPending(true);
      setError(null);

      try {
        let data: TData;

        try {
          data = await mutationFn();
        } catch (error) {
          const mutationError =
            error instanceof Error
              ? error
              : new Error('알 수 없는 에러가 발생했습니다.');

          setError(mutationError);
          await options.onError?.(mutationError);

          throw mutationError;
        }

        await options.onSuccess?.(data);

        return data;
      } finally {
        setIsPending(false);
      }
    },
    [],
  );

  return {
    mutate,
    isPending,
    error,
  };
}
