import { CartDB } from "@db/inMemoryDB";

export const getCartsQuery = () => {
  const carts = [...CartDB];

  return carts;
};

export const deleteCartQuery = (productId: number) => {
  const cartItem = getCartItemByProductIdQuery(productId);
  if (cartItem) CartDB.delete(cartItem);

  return productId;
};

export const getCartItemByProductIdQuery = (productId: number) => {
  return [...CartDB.values()].find((item) => item.product.id === productId);
};

export const updateCartQuantityQuery = (
  productId: number,
  quantity: number,
) => {
  const cartItem = [...CartDB.values()].find(
    (item) => item.product.id === productId,
  );

  if (!cartItem) return undefined;

  cartItem.quantity = quantity;
  return cartItem;
};

export const deleteCartsProductQuery = (productId: number) => {
  const cartItem = getCartItemByProductIdQuery(productId);
  if (cartItem) CartDB.delete(cartItem);
  return productId;
};
