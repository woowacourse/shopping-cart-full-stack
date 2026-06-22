import type {PreorderItem} from '../../types/preorder.js';

const BASE_SHIPPING_FEE = 3000;
const REMOTE_AREA_EXTRA_FEE = 3000;
const FREE_SHIPPING_MIN_ORDER_AMOUNT = 100000;

export const calculateOrderAmount = (items: PreorderItem[]): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const calculateShippingFee = (orderAmount: number, isRemoteArea: boolean): number => {
  const baseShippingFee = orderAmount >= FREE_SHIPPING_MIN_ORDER_AMOUNT ? 0 : BASE_SHIPPING_FEE;
  const remoteAreaFee = isRemoteArea ? REMOTE_AREA_EXTRA_FEE : 0;

  return baseShippingFee + remoteAreaFee;
};
