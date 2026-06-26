import type { CartItemResponse } from '../../apis/cart';

const FREE_SHIPPING_THRESHOLD = 100_000;
const SHIPPING_FEE = 3_000;

export const calCartSummary = (
  cartItems: CartItemResponse[],
  selectedProductIds: string[],
) => {
  const orderAmount = cartItems
    .filter(({ product }) => selectedProductIds.includes(product.id))
    .reduce(
      (total, { product, quantity }) => total + product.price * quantity,
      0,
    );

  const shippingFee =
    orderAmount === 0 || orderAmount >= FREE_SHIPPING_THRESHOLD
      ? 0
      : SHIPPING_FEE;

  return {
    orderAmount,
    shippingFee,
    totalPaymentAmount: orderAmount + shippingFee,
  };
};
