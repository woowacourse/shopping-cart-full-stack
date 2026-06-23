export type QueryKey = string;

export type QueryState<T> = {
  data: T;
};

type QueryListener = () => void;

export class QueryClient {
  private cache = new Map<QueryKey, QueryState<unknown>>();
  private listeners = new Map<QueryKey, Set<QueryListener>>();
  private fetchingQueries = new Map<QueryKey, Promise<unknown>>();
  private generation = 0;

  getQueryState<T>(queryKey: QueryKey) {
    return this.cache.get(queryKey) as QueryState<T> | undefined;
  }

  getQueryData<T>(queryKey: QueryKey) {
    return this.getQueryState<T>(queryKey)?.data;
  }

  setQueryData<T>(queryKey: QueryKey, data: T) {
    this.cache.set(queryKey, { data });
    this.notify(queryKey);
  }

  removeQueries(queryKey: QueryKey) {
    if (!this.cache.delete(queryKey)) return;

    this.notify(queryKey);
  }

  clear() {
    const queryKeys = [...this.cache.keys()];
    this.cache.clear();

    queryKeys.forEach((queryKey) => this.notify(queryKey));
  }

  reset() {
    this.generation += 1;
    this.cache.clear();
    this.fetchingQueries.clear();
    this.listeners.clear();
  }

  subscribe(queryKey: QueryKey, listener: QueryListener) {
    const listeners = this.listeners.get(queryKey) ?? new Set<QueryListener>();
    listeners.add(listener);
    this.listeners.set(queryKey, listeners);

    return () => {
      listeners.delete(listener);

      if (listeners.size === 0) {
        this.listeners.delete(queryKey);
      }
    };
  }

  fetchQuery<T>(queryKey: QueryKey, queryFn: () => Promise<T>) {
    const fetchingQuery = this.fetchingQueries.get(queryKey);

    if (fetchingQuery) {
      return fetchingQuery as Promise<T>;
    }

    const requestGeneration = this.generation;
    const promise = queryFn()
      .then((data) => {
        if (requestGeneration === this.generation) {
          this.setQueryData(queryKey, data);
        }

        return data;
      })
      .finally(() => {
        if (requestGeneration === this.generation) {
          this.fetchingQueries.delete(queryKey);
        }
      });

    this.fetchingQueries.set(queryKey, promise);

    return promise;
  }

  private notify(queryKey: QueryKey) {
    this.listeners.get(queryKey)?.forEach((listener) => listener());
  }
}

export const queryClient = new QueryClient();
