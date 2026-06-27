const SELECTED_CART_ITEM_IDS_KEY = "selectedCartItemIds";

export function getSelectedItems(): number[] | null {
  const value = localStorage.getItem(SELECTED_CART_ITEM_IDS_KEY);
  if (value === null) return null;

  return JSON.parse(value);
}

export function saveSelectedItems(itemIds: number[]) {
  localStorage.setItem(SELECTED_CART_ITEM_IDS_KEY, JSON.stringify(itemIds));
}
