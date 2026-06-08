import { PRICE_CONSTATNS } from "../constants/constants";
import { CartItem } from "../type/types";

interface Props {
  cartItems: CartItem[];
  selectedItems: Map<number, boolean>;
}

export const getOrderPrice = ({ cartItems, selectedItems }: Props) => {
  const orderPrice = cartItems
    .filter((cartItem) => selectedItems.get(cartItem.cartItemId))
    .reduce(
      (acc, cartItem) => acc + cartItem.productData.price * cartItem.quantity,
      0,
    );
  const deliveryPrice =
    Number(orderPrice) >= PRICE_CONSTATNS.FREE_DELIVERY_CONDITION_COST
      ? 0
      : PRICE_CONSTATNS.DEFAULT_DELIVERY_COST;
  const totalPrice = Number(orderPrice) + Number(deliveryPrice);
  return { orderPrice, deliveryPrice, totalPrice };
};

export const totalQuantity = ({ cartItems, selectedItems }: Props) => {
  return cartItems
    .filter((cartItem) => selectedItems.get(cartItem.cartItemId))
    .reduce((acc, cartItem) => acc + cartItem.quantity, 0);
};
