export type QueryKey = readonly unknown[];

function hashQueryKey(queryKey: QueryKey): string {
  return JSON.stringify(queryKey);
}

function matchQueryKey(filterKey: QueryKey, targetKey: QueryKey): boolean {
  return filterKey.every((filterItem) =>
    targetKey.some((targetItem) => JSON.stringify(filterItem) === JSON.stringify(targetItem)),
  );
}

export default class QueryStore {
  private queryCache: Map<string, unknown>;
  private promiseCache: Map<string, Promise<unknown>>;
  private errorCache: Map<string, Error>;
  private listeners: Map<string, Set<() => void>>;
  private queryKeys: Map<string, QueryKey>;

  constructor() {
    this.queryCache = new Map();
    this.promiseCache = new Map();
    this.errorCache = new Map();
    this.listeners = new Map();
    this.queryKeys = new Map();
  }

  getSnapshot(key: QueryKey) {
    return this.queryCache.get(hashQueryKey(key));
  }

  getError(key: QueryKey) {
    return this.errorCache.get(hashQueryKey(key));
  }

  fetch<T>(key: QueryKey, queryFn: () => Promise<T>) {
    const hashedKey = hashQueryKey(key);
    this.queryKeys.set(hashedKey, key);

    const inFlight = this.promiseCache.get(hashedKey);
    if (inFlight) {
      return inFlight as Promise<T>;
    }

    const promise = queryFn()
      .then((data) => {
        this.setQuery(key, data);
        return data;
      })
      .catch((error) => {
        this.setError(key, error);
        throw error;
      });

    this.promiseCache.set(hashedKey, promise);

    return promise;
  }

  setQuery(key: QueryKey, data: unknown) {
    const hashedKey = hashQueryKey(key);
    this.queryKeys.set(hashedKey, key);
    this.queryCache.set(hashedKey, data);
    this.listeners.get(hashedKey)?.forEach((callback) => callback());
  }

  setError(key: QueryKey, error: unknown) {
    const hashedKey = hashQueryKey(key);
    this.queryKeys.set(hashedKey, key);
    this.errorCache.set(hashedKey, error as Error);
    this.listeners.get(hashedKey)?.forEach((callback) => callback());
  }

  invalidate(filterKey: QueryKey) {
    for (const [hashedKey, cachedKey] of this.queryKeys.entries()) {
      if (matchQueryKey(filterKey, cachedKey)) {
        this.queryCache.delete(hashedKey);
        this.promiseCache.delete(hashedKey);
        this.errorCache.delete(hashedKey);
        this.queryKeys.delete(hashedKey);
        this.listeners.get(hashedKey)?.forEach((callback) => callback());
      }
    }
  }

  clear() {
    this.queryCache.clear();
    this.promiseCache.clear();
    this.errorCache.clear();
    this.queryKeys.clear();
    this.listeners.forEach((callbacks) => callbacks.forEach((cb) => cb()));
  }

  subscribe(key: QueryKey, callback: () => void) {
    const hashedKey = hashQueryKey(key);
    this.queryKeys.set(hashedKey, key);

    if (!this.listeners.has(hashedKey)) {
      this.listeners.set(hashedKey, new Set());
    }
    this.listeners.get(hashedKey)?.add(callback);

    return () => {
      this.listeners.get(hashedKey)?.delete(callback);
    };
  }
}
