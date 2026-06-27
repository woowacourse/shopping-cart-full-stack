import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../../api/errors/ApiError';

// Map 형태의 캐시
const queryCache = new Map<string, unknown>();

type UseQueryResult<T> = {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<T | null>;
  setQueryData: (updater: (previousData: T) => T) => void;
};

export function useQuery<T>(
  queryKey: string,
  queryFn: () => Promise<T>,
): UseQueryResult<T>;

export function useQuery<T>(
  queryKey: string,
  queryFn: (id: string) => Promise<T>,
  id: string | undefined,
  enabled?: boolean,
): UseQueryResult<T>;

export function useQuery<T>(
  queryKey: string,
  queryFn: (() => Promise<T>) | ((id: string) => Promise<T>),
  id?: string,
  enabled = true,
): UseQueryResult<T> {
  const cachedData = queryCache.get(queryKey) as T | undefined;

  const [state, setState] = useState<
    Omit<UseQueryResult<T>, 'refetch' | 'setQueryData'>
  >({
    data: cachedData ?? null,
    isLoading: enabled && !cachedData,
    error: null,
  });

  const executeQuery = useCallback(async () => {
    if (!enabled) return null;

    try {
      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
      }));

      const result =
        id === undefined
          ? await (queryFn as () => Promise<T>)()
          : await (queryFn as (queryId: string) => Promise<T>)(id);
      queryCache.set(queryKey, result);

      setState({
        data: result,
        isLoading: false,
        error: null,
      });

      return result;
    } catch (error) {
      setState({
        data: null,
        isLoading: false,
        error:
          error instanceof ApiError
            ? error
            : new Error('알 수 없는 에러가 발생했습니다.'),
      });
      return null;
    }
  }, [enabled, id, queryKey, queryFn]);

  useEffect(() => {
    if (!enabled || queryCache.has(queryKey)) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    executeQuery();
  }, [enabled, executeQuery, queryKey]);

  const setQueryData = useCallback(
    (updater: (previousData: T) => T) => {
      const previousData = queryCache.get(queryKey) as T | undefined;

      if (previousData === undefined) {
        return;
      }

      const nextData = updater(previousData);
      queryCache.set(queryKey, nextData);

      setState({
        data: nextData,
        isLoading: false,
        error: null,
      });
    },

    [queryKey],
  );

  return {
    data: state.data,
    isLoading: state.isLoading,
    error: state.error,
    refetch: executeQuery,
    setQueryData,
  };
}
