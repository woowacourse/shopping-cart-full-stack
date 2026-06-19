import type {PreorderItem} from '../types/preorder.js';

const DEFAULT_SHIPPING_FEE = 3000;
const REMOTE_AREA_FEE = 3000;

export const calculateOrderAmount = (items: PreorderItem[]) => {
  return items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
};

export const calculateShippingFee = (isRemoteArea: boolean) => {
  return DEFAULT_SHIPPING_FEE + (isRemoteArea ? REMOTE_AREA_FEE : 0);
};
