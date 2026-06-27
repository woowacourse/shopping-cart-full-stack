import { useEffect, useState } from "react";
import { NetworkError } from "../apis/cart.api";

export default function useMutation() {
  const [mutationError, setMutationError] = useState<Error | null>(null);
  const [mutationLoading, setMutationLoading] = useState<boolean>(false);

  useEffect(() => {
    if (mutationError === null) return;

    const timerId = setTimeout(() => {
      setMutationError(null);
    }, 2000);

    return () => {
      clearTimeout(timerId);
    };
  }, [mutationError]);

  async function mutate({
    api,
    onSuccess,
    onNetworkError,
  }: {
    api: () => Promise<void>;
    onSuccess: () => void;
    onNetworkError: () => Promise<void>;
  }) {
    try {
      setMutationLoading(true);
      await api();
      onSuccess();
    } catch (error) {
      if (error instanceof Error) setMutationError(error);
      if (error instanceof NetworkError) await onNetworkError();
    } finally {
      setMutationLoading(false);
    }
  }

  return { mutationLoading, mutationError, mutate };
}
