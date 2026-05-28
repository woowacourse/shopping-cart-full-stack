import type { CartItemData } from "../repositories/CartItem";
import { productRepository } from "../repositories/ProductRepository";
import { cartRepository } from "../repositories/CartRepository";

export const getCartItemsService = (): CartItemData[] => {
  return cartRepository.getCartProducts();
};

export const postCartItemService = (productId: number, quantity: number): CartItemData => {
  const product = productRepository.findById(Number(productId));
  if (!product) throw Error("해당 상품이 존재하지 않습니다.");

  return cartRepository.addProductToCart(productId, quantity);
};

export const deleteCartItemService = (cartItemId: number): void => {
  if (!cartItemId) throw new Error("유효하지 않은 장바구니 ID입니다.");

  const cartItem = cartRepository.findById(cartItemId);
  if (!cartItem) throw new Error("해당 장바구니 상품이 존재하지 않습니다.");

  cartRepository.deleteByCartId(cartItemId);
};

export const patchCartItemService = (cartItemId: number, newQuantity: number): CartItemData => {
  if (!cartItemId) throw new Error("유효하지 않은 장바구니 ID입니다.");
  if (!newQuantity) throw new Error("유효하지 않은 수량입니다.");

  const updatedQuantity = cartRepository.changeQuantity(cartItemId, newQuantity);
  if (!updatedQuantity)
    throw new Error("해당 장바구니 상품이 존재하지 않습니다.");

  return updatedQuantity;
};
