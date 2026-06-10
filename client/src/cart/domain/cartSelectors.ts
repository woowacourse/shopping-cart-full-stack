import type {CartItem, CartItemId} from './types.js';

export const FREE_SHIPPING_THRESHOLD = 100000;
const SHIPPING_FEE = 3000;

type CartSelectionInput = {
  items: CartItem[];
  selectedIds: CartItemId[];
};

function getSelectedCartItems({items, selectedIds}: CartSelectionInput) {
  return items.filter((item) => selectedIds.includes(item.id));
}

export function getSelectedOrderAmount(cartSelection: CartSelectionInput) {
  const selectedItems = getSelectedCartItems(cartSelection);

  return selectedItems.reduce((orderAmount, item) => {
    return orderAmount + item.productInfo.price * item.quantity;
  }, 0);
}

export function getShippingFee(cartSelection: CartSelectionInput) {
  const selectedOrderAmount = getSelectedOrderAmount(cartSelection);

  if (selectedOrderAmount === 0) return 0;
  if (selectedOrderAmount >= FREE_SHIPPING_THRESHOLD) return 0;

  return SHIPPING_FEE;
}

export function getTotalPrice(cartSelection: CartSelectionInput) {
  const selectedOrderAmount = getSelectedOrderAmount(cartSelection);
  const shippingFee = getShippingFee(cartSelection);

  return selectedOrderAmount + shippingFee;
}

export function getSelectedItemCount(cartSelection: CartSelectionInput) {
  return getSelectedCartItems(cartSelection).length;
}

export function getSelectedQuantity(cartSelection: CartSelectionInput) {
  return getSelectedCartItems(cartSelection).reduce((selectedQuantity, item) => {
    return selectedQuantity + item.quantity;
  }, 0);
}
