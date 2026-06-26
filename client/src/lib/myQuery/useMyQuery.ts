import { useContext, useEffect, useState } from "react";
import { MyQueryContext } from "./MyQueryContext";
import type { QueryState } from "./MyQueryClient";

interface UseMyQueryOptions<T> {
  initialData?: T;
}

export function useMyQuery<T>(queryKey: string, queryFn: () => Promise<T>, options: UseMyQueryOptions<T> = {}) {
  const myQueryClient = useContext(MyQueryContext);
  if (!myQueryClient) {
    throw new Error("useMyQuery는 MyQueryProvider 안에서 사용해야 합니다.");
  }

  const { initialData } = options;

  const [queryState, setQueryState] = useState<QueryState<T>>({
    status: initialData !== undefined ? "success" : "idle",
    data: initialData ?? null,
    error: null,
  });

  useEffect(() => {
    myQueryClient.createQueryRecord(queryKey, queryFn);
    if (initialData !== undefined && myQueryClient.getQueryData<T>(queryKey) === null) {
      myQueryClient.setQueryData<T>(queryKey, initialData);
    }

    const unsubscribe = myQueryClient.subscribe(queryKey, () => {
      const nextState = myQueryClient.getQueryState<T>(queryKey);
      if (nextState) setQueryState(nextState);
    });

    myQueryClient.fetchQuery<T>(queryKey).catch(() => {});

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey]);

  return {
    data: queryState.data,
    error: queryState.error,
    isLoading: queryState.status === "loading",
    hasError: queryState.status === "error",
    refetch: () => myQueryClient.fetchQuery<T>(queryKey),
  };
}
