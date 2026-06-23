import {
  useCallback,
  useEffect,
  useEffectEvent,
  useState,
  useSyncExternalStore,
} from 'react';

import { queryClient } from '../query/QueryClient';

type UseQueryResult<T> = {
  data: T | null;
  isPending: boolean;
  error: Error | null;
};

type QueryStatus = {
  queryKey: string;
  isPending: boolean;
  error: Error | null;
};

function getError(error: unknown) {
  return error instanceof Error
    ? error
    : new Error('알 수 없는 에러가 발생했습니다.');
}

export function useQuery<T>(
  queryKey: string,
  queryFn: () => Promise<T>,
): UseQueryResult<T> {
  const subscribe = useCallback(
    (listener: () => void) => queryClient.subscribe(queryKey, listener),
    [queryKey],
  );
  const getSnapshot = useCallback(
    () => queryClient.getQueryState<T>(queryKey),
    [queryKey],
  );
  const cachedQuery = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const hasCachedQuery = cachedQuery !== undefined;
  const [status, setStatus] = useState<QueryStatus>(() => ({
    queryKey,
    isPending: !hasCachedQuery,
    error: null,
  }));

  const executeQuery = useEffectEvent(async () => {
    return queryFn();
  });

  useEffect(() => {
    let ignore = false;
    const query = queryClient.getQueryState<T>(queryKey);

    if (query) {
      return;
    }

    queryClient
      .fetchQuery(queryKey, executeQuery)
      .then(() => {
        if (ignore) return;

        setStatus({
          queryKey,
          isPending: false,
          error: null,
        });
      })
      .catch((error: unknown) => {
        if (ignore) return;

        setStatus({
          queryKey,
          isPending: false,
          error: getError(error),
        });
      });

    return () => {
      ignore = true;
    };
  }, [queryKey]);

  if (status.queryKey !== queryKey) {
    return {
      data: cachedQuery?.data ?? null,
      isPending: !cachedQuery,
      error: null,
    };
  }

  return {
    data: cachedQuery?.data ?? null,
    isPending: !hasCachedQuery && status.isPending,
    error: status.error,
  };
}

export function setQueryData<T>(queryKey: string, updateFn: (data: T) => T) {
  const cachedData = queryClient.getQueryData<T>(queryKey);
  if (cachedData === undefined) return;

  queryClient.setQueryData(queryKey, updateFn(cachedData));
}

export function clearQueryCache() {
  queryClient.reset();
}
