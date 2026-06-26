import type { CartItemModel } from "./cart.api";
import { DELIVERY } from "./cart.constants";

export const getOrderPrice = (filteredCartItem: CartItemModel[]) => {
  return filteredCartItem.reduce(
    (acc, cartItem) => acc + cartItem.price * cartItem.itemCount,
    0,
  );
};

export const getFilteredCartItem = (
  cartItems: CartItemModel[],
  selectedProductIds: number[],
) => {
  return cartItems.filter((cartItem) =>
    selectedProductIds.includes(cartItem.productId),
  );
};

export const getDeliveryFee = (orderPrice: number) => {
  return orderPrice >= DELIVERY.FREE_PRICE_BOUNDARY ? 0 : DELIVERY.FEE;
};

export const getTotalPrice = (orderPrice: number, deliveryFee: number) => {
  return orderPrice + deliveryFee;
};
