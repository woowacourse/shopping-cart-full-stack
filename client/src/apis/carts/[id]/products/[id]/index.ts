import { CARTS_API } from "@apis/carts";
import { PRODUCTS_API } from "@apis/carts/[id]/products";
import fetcher from "@apis/instance";
import { mapServerCartItemToCart } from "@apis/carts/dto";
import type { ServerUpdateCartItemQuantityResponse } from "@apis/carts/dto";

export const updateCartItemQuantity = async (cartId: number, productId: number, quantity: number) => {
  const response = await fetcher.patch<ServerUpdateCartItemQuantityResponse>(
    `${CARTS_API}/${cartId}/${PRODUCTS_API}/${productId}`,
    { quantity },
  );
  return mapServerCartItemToCart(response);
};

export const deleteCartItem = async (cartId: number, productId: number) => {
  await fetcher.delete(`${CARTS_API}/${cartId}/${PRODUCTS_API}/${productId}`);
};
