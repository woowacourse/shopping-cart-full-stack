import type {PreorderItem} from '../types/preorder.js';

const BASE_SHIPPING_FEE = 3000;
const REMOTE_AREA_EXTRA_FEE = 3000;

export const calculateOrderAmount = (items: PreorderItem[]): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const calculateShippingFee = (isRemoteArea: boolean): number => {
  return BASE_SHIPPING_FEE + (isRemoteArea ? REMOTE_AREA_EXTRA_FEE : 0);
};
