import useLocalStorageValue from "@hooks/common/useLocalStorageValue";

const STORAGE_KEY = "checkedItems";

export default function useCheckedProductItems<T>() {
  const { value, setValue } = useLocalStorageValue<T[]>(STORAGE_KEY, []);

  const select = (item: T) => {
    setValue((prev) => [...new Set([...prev, item])]);
  };

  const unselect = (item: T) => {
    setValue((prev) => prev.filter((prevItem) => !Object.is(prevItem, item)));
  };

  const unselectAll = () => {
    setValue([]);
  };

  const updateCheckedItems = (items: T[] | ((prev: T[]) => T[])) => {
    if (typeof items === "function") {
      setValue((prev) => items(prev));
      return;
    }

    setValue(items);
  };

  return {
    checkedItems: value,
    select,
    unselect,
    unselectAll,
    updateCheckedItems,
  };
}
