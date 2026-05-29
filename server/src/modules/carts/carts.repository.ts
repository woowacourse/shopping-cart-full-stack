import { CartDB } from "@db/inMemoryDB";

export const getCartsQuery = () => {
  const carts = [...CartDB.values()];

  return carts;
};

export const deleteCartQuery = (productId: number) => {
  CartDB.delete(productId);

  return productId;
};

export const getCartItemByProductIdQuery = (productId: number) => {
  return CartDB.get(productId);
};

export const updateCartQuantityQuery = (
  productId: number,
  quantity: number,
) => {
  const cartItem = CartDB.get(productId);

  if (!cartItem) return undefined;

  cartItem.quantity = quantity;
  return cartItem;
};

export const deleteCartsProductQuery = (id: number) => {
  CartDB.delete(id);
  return id;
};
