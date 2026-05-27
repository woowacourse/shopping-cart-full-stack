import { CartItem } from './cartItem.model.js';
import { cartItemRepository } from './cartItem.repository.js';

export const cartItemService = {
  addCartItem(productId: string) {
    const cartItem = new CartItem({
      cartItemId: crypto.randomUUID(),
      productId: productId,
      purchaseQuantity: 1,
    });
    cartItemRepository.save(cartItem);
    return { cartItemId: cartItem.cartItemId };
  },

  getCartItems() {
    return cartItemRepository.findAll();
  },

  getCartItemById(cartItemId: string) {
    const cartItem = cartItemRepository.findById(cartItemId);

    if (!cartItem) throw new Error('존재하지 않는 상품입니다.');

    return cartItem;
  },

  deleteCartItem(cartItemId: string) {
    const isDeleted = cartItemRepository.deleteById(cartItemId);

    if (!isDeleted) throw new Error('존재하지 않는 상품입니다.');
  },

  changePurchaseQuantity(cartItemId: string, quantity: number) {
    const cartItem = this.getCartItemById(cartItemId);
    cartItem.purchaseQuantity = quantity;
  },
};
