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
  const deliveryPrice = Number(orderPrice) >= 100000 ? 0 : 3000;
  const totalPrice = Number(orderPrice) + Number(deliveryPrice);
  return { orderPrice, deliveryPrice, totalPrice };
};

export const totalQuantity = ({ cartItems, selectedItems }: Props) => {
  return cartItems
    .filter((cartItem) => selectedItems.get(cartItem.cartItemId))
    .reduce((acc, cartItem) => acc + cartItem.quantity, 0);
};
