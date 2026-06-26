import type { CartItemType } from '../types/cartItemType';

const FREE_DELIVERY_THRESHOLD = 100000;
const DEFAULT_DELIVERY_FEE = 3000;

export const calculateOrderAmount = (cartProducts: CartItemType[], checkedIds: Set<number>): number =>
  cartProducts
    .filter((product) => checkedIds.has(product.id))
    .reduce((sum, product) => sum + product.price * product.quantity, 0);

export const calculateDeliveryFee = (orderAmount: number): number => {
  if (orderAmount >= FREE_DELIVERY_THRESHOLD || orderAmount === 0) return 0;
  return DEFAULT_DELIVERY_FEE;
};
