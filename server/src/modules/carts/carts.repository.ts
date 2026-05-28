import { CartDB } from "@db/inMemoryDB";

export const getCartsQuery = () => {
  // 장바구니 조회
  const carts = [...CartDB];

  return carts;
};

export const deleteCartQuery = (productId: number) => {
  CartDB.delete(productId);

  return productId;
};

export const getCartItemByProductIdQuery = (productId: number) => {
  const cartItems = [...CartDB.values()].find((item) => item === productId);

  return cartItems;
};
