import type { CartItem } from './types';

export function getSelectedCartItems(cartItems: CartItem[]) {
  return cartItems.filter((item) => item.isSelected);
}

export function isAllCartItemsSelected(cartItems: CartItem[]) {
  return cartItems.length > 0 && cartItems.every((item) => item.isSelected);
}
