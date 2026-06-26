const CART_SELECTION_KEY = "cart_selection";

export function getItemSelectionFromStorage(): Record<number, boolean> {
  try {
    const stored = localStorage.getItem(CART_SELECTION_KEY);
    return stored ? (JSON.parse(stored) as Record<number, boolean>) : {};
  } catch {
    return {};
  }
}

export function saveItemSelectionToStorage(id: number, isSelected: boolean): void {
  const stored = getItemSelectionFromStorage();
  stored[id] = isSelected;
  localStorage.setItem(CART_SELECTION_KEY, JSON.stringify(stored));
}

export function removeItemSelectionFromStorage(id: number): void {
  const stored = getItemSelectionFromStorage();
  delete stored[id];
  localStorage.setItem(CART_SELECTION_KEY, JSON.stringify(stored));
}
