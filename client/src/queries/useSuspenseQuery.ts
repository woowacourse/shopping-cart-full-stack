import { useSyncExternalStore } from "react";
import { queryStore } from "@/queries/instance";
import type { QueryKey } from "./stores/queryStore";
interface UseQueryParams<T> {
  key: QueryKey;
  queryFn: () => Promise<T>;
}

export default function useSuspenseQuery<T>({
  key,
  queryFn,
}: UseQueryParams<T>) {
  const data = useSyncExternalStore<T | undefined>(
    (onStoreChange) => queryStore.subscribe(key, onStoreChange),
    () => queryStore.getSnapshot(key) as T | undefined,
  );

  const error = queryStore.getError(key);

  if (error) throw error;
  if (!data) throw queryStore.fetch(key, queryFn);

  return { data, error };
}
