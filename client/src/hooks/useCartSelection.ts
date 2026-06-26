import { useState } from "react";
import { getItemSelectionFromStorage, saveItemSelectionToStorage } from "../storage/cartSelection";

export function useCartSelection() {
  const [selectionMap, setSelectionMap] = useState<Record<number, boolean>>(() => getItemSelectionFromStorage());

  const getItemSelection = (id: number): boolean => {
    return selectionMap[id] ?? true;
  };

  const toggleItemSelection = (id: number) => {
    const nextSelected = !getItemSelection(id);
    saveItemSelectionToStorage(id, nextSelected);
    setSelectionMap((prev) => ({ ...prev, [id]: nextSelected }));
  };

  const toggleAllItemSelection = (ids: number[], shouldSelectAll: boolean) => {
    ids.forEach((id) => saveItemSelectionToStorage(id, shouldSelectAll));
    setSelectionMap((prev) => {
      const next = { ...prev };
      ids.forEach((id) => {
        next[id] = shouldSelectAll;
      });
      return next;
    });
  };

  return { getItemSelection, toggleItemSelection, toggleAllItemSelection };
}
