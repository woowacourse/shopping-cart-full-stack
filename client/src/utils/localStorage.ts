export const LOCAL_STORAGE_CHANGE_EVENT = "local-storage-change";

export const getItemsFromLocalStorage = <T>(key: string) => {
  const items = localStorage.getItem(key);
  if (!items) return null;
  return JSON.parse(items) as T;
};

export const setItemsToLocalStorage = <T>(key: string, items: T) => {
  localStorage.setItem(key, JSON.stringify(items));

  window.dispatchEvent(
    new CustomEvent(LOCAL_STORAGE_CHANGE_EVENT, { detail: { key } }),
  );
};

export const removeItemsFromLocalStorage = (key: string) => {
  localStorage.removeItem(key);
  window.dispatchEvent(
    new CustomEvent(LOCAL_STORAGE_CHANGE_EVENT, { detail: { key } }),
  );
};
