import { useCallback, useState } from "react";
import { normalizeError, type AsyncError } from "../error/normalizeError";

export type AsyncState<T> =
  | { status: "idle"; data: null; error: null }
  | { status: "loading"; data: null; error: null }
  | { status: "success"; data: T; error: null }
  | { status: "fail"; data: null; error: AsyncError };

export type ExecuteAsyncFunctionProps<T> = {
  asyncFunction: () => Promise<T>;
  options?: {
    onSuccess?: (data: T) => void;
    onFail?: (error: AsyncError) => void;
    showLoading?: boolean;
  };
};

const useAsyncTask = <T>() => {
  const [asyncState, setAsyncState] = useState<AsyncState<T>>({
    status: "idle",
    data: null,
    error: null,
  });

  const setLoading = useCallback(() => {
    setAsyncState({
      status: "loading",
      data: null,
      error: null,
    });
  }, []);

  const setSuccess = useCallback((data: T) => {
    setAsyncState({
      status: "success",
      data,
      error: null,
    });
  }, []);

  const setFail = useCallback((error: AsyncError) => {
    setAsyncState({
      status: "fail",
      data: null,
      error,
    });
  }, []);

  const executeAsyncFunction = useCallback(
    async ({
      asyncFunction,
      options,
    }: ExecuteAsyncFunctionProps<T>): Promise<void> => {
      if (options?.showLoading) setLoading();
      try {
        const data = await asyncFunction();
        setSuccess(data);
        options?.onSuccess?.(data);
      } catch (error) {
        const normalizedError = normalizeError(error);
        setFail(normalizedError);
        options?.onFail?.(normalizedError);
      }
    },
    [setLoading, setSuccess, setFail],
  );

  const setData = (nextData: T) => {
    if (asyncState.status === "success") {
      setAsyncState({
        status: "success",
        data: nextData,
        error: null,
      });
    }
  };

  return {
    asyncState,
    executeAsyncFunction,
    setData,
  };
};

export default useAsyncTask;
