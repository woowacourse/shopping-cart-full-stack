import type { CartItemData } from "../repositories/CartItem";
import { productRepository } from "../repositories/ProductRepository";
import { cartRepository } from "../repositories/CartRepository";
import { InvalidError, NotFoundError } from "../errors/CustomErrorClass";
import { ERROR_MESSAGE } from "../errors/ErrorMessage";

export const getCartItemsService = (): CartItemData[] => {
  return cartRepository.getCartProducts();
};

export const postCartItemService = (productId: number, quantity: number): CartItemData => {
  const product = productRepository.findById(Number(productId));
  if (!product) throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND_PRODUCT);

  return cartRepository.addProductToCart(productId, quantity);
};

export const deleteCartItemService = (cartItemId: number): void => {
  if (!cartItemId) throw new InvalidError(ERROR_MESSAGE.INVALID_CART_ID);

  const cartItem = cartRepository.findById(cartItemId);
  if (!cartItem) throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND_CART_ITEM);

  cartRepository.deleteByCartId(cartItemId);
};

export const patchCartItemService = (cartItemId: number, newQuantity: number): CartItemData => {
  if (!cartItemId) throw new InvalidError(ERROR_MESSAGE.INVALID_CART_ID);
  if (!newQuantity) throw new InvalidError(ERROR_MESSAGE.INVALID_QUANTITY);

  const updatedQuantity = cartRepository.changeQuantity(cartItemId, newQuantity);
  if (!updatedQuantity) throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND_CART_ITEM);

  return updatedQuantity;
};
