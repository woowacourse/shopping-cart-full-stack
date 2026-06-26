import {
  LOCAL_STORAGE_CHANGE_EVENT,
  setItemsToLocalStorage,
} from "@utils/localStorage";
import { useRef, useSyncExternalStore } from "react";

const subscribe = (callback: () => void) => {
  window.addEventListener(LOCAL_STORAGE_CHANGE_EVENT, callback);

  return () => window.removeEventListener(LOCAL_STORAGE_CHANGE_EVENT, callback);
};

function useLocalStorageValue<T>(key: string, fallback: T) {
  const cache = useRef<{ raw: string | null; value: T }>({
    raw: null,
    value: fallback,
  });

  const getSnapshot = () => {
    const raw = localStorage.getItem(key);

    if (raw === cache.current.raw) return cache.current.value;

    cache.current = {
      raw,
      value: raw ? (JSON.parse(raw) as T) : fallback,
    };

    return cache.current.value;
  };

  const value = useSyncExternalStore(subscribe, getSnapshot);

  const setValue = (newValue: T | ((prev: T) => T)) => {
    setItemsToLocalStorage(
      key,
      typeof newValue === "function"
        ? (newValue as (prev: T) => T)(getSnapshot())
        : newValue,
    );
  };

  return { value, setValue };
}

export default useLocalStorageValue;
