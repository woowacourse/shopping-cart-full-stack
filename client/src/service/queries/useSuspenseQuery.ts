import { useState, useSyncExternalStore } from "react";
import { queryStore } from "@/service/queries/instance";
interface UseQueryParams<T> {
  key: string;
  queryFn: () => Promise<T>;
}

export default function useSuspenseQuery<T>({
  key,
  queryFn,
}: UseQueryParams<T>) {
  const setFlush = useState(false)[1];

  const data = useSyncExternalStore<T | undefined>(
    () => queryStore.subscribe(key, () => setFlush((prev) => !prev)),
    () => queryStore.getSnapshot(key) as T | undefined,
  );

  const error = queryStore.getError(key);

  if (error) throw error;
  if (!data) throw queryStore.fetch(key, queryFn);

  return { data, error };
}
