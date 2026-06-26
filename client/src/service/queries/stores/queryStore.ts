export default class QueryStore {
  private queryCache: Map<string, unknown>;
  private promiseCache: Map<string, Promise<unknown>>;
  private errorCache: Map<string, Error>;
  private listeners: Map<string, Set<() => void>>;

  constructor() {
    this.queryCache = new Map();
    this.promiseCache = new Map();
    this.errorCache = new Map();
    this.listeners = new Map();
  }

  getSnapshot(key: string) {
    return this.queryCache.get(key);
  }

  getError(key: string) {
    return this.errorCache.get(key);
  }

  fetch<T>(key: string, queryFn: () => Promise<T>) {
    const inFlight = this.promiseCache.get(key);
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
      })
      .finally(() => {
        this.promiseCache.delete(key);
      });

    this.promiseCache.set(key, promise);

    return promise;
  }

  setQuery(key: string, data: unknown) {
    this.queryCache.set(key, data);
    this.listeners.get(key)?.forEach((callback) => callback());
  }

  setError(key: string, error: unknown) {
    this.errorCache.set(key, error as Error);
    this.listeners.get(key)?.forEach((callback) => callback());
  }

  invalidate(key: string) {
    this.queryCache.delete(key);
    this.promiseCache.delete(key);
    this.errorCache.delete(key);
    this.listeners.get(key)?.forEach((callback) => callback());
  }

  subscribe(key: string, callback: () => void) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)?.add(callback);

    return () => {
      this.listeners.get(key)?.delete(callback);
    };
  }
}
