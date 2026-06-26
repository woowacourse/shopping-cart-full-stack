import { queryStore } from "@/service/queries/instance";
import { useState } from "react";

export interface MutateOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: unknown) => void;
}

interface UseMutationParams<T, V> extends MutateOptions<T> {
  mutateFn: (variables: V) => Promise<T>;
}

export default function useMutation<T, V = void>({
  mutateFn,
  onSuccess,
  onError,
}: UseMutationParams<T, V>) {
  const [isLoading, setIsLoading] = useState(false);

  const mutate = async (variables: V, options?: MutateOptions<T>) => {
    try {
      setIsLoading(true);
      const res = await mutateFn(variables);
      onSuccess?.(res);
      options?.onSuccess?.(res);
    } catch (e) {
      onError?.(e);
      options?.onError?.(e);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, mutate, invalidate: queryStore.invalidate };
}
