import type {CartItemId} from './types.js';

const SELECTED_CART_ITEM_IDS_STORAGE_KEY = 'shopping-cart-selected-cart-item-ids';

export function loadSelectedCartItemIds(): CartItemId[] | null {
  const currentSelectedIds = localStorage.getItem(SELECTED_CART_ITEM_IDS_STORAGE_KEY);

  if (currentSelectedIds === null) return null;

  try {
    const selectedIds = JSON.parse(currentSelectedIds);

    if (!isCartItemIdArray(selectedIds)) return null;

    return selectedIds;
  } catch {
    return null;
  }
}

export function saveSelectedCartItemIds(selectedIds: CartItemId[]): void {
  localStorage.setItem(SELECTED_CART_ITEM_IDS_STORAGE_KEY, JSON.stringify(selectedIds));
}

function isCartItemIdArray(value: unknown): value is CartItemId[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}
