import { cartItemsDB } from '../../db.js';
import { CartItem } from './cartItem.model.js';

export const cartItemRepository = {
  save(cartItem: CartItem) {
    cartItemsDB.set(cartItem.cartItemId, cartItem);
    return cartItem;
  },

  findAll() {
    return Array.from(cartItemsDB.values());
  },

  findById(cartItemId: string) {
    return cartItemsDB.get(cartItemId);
  },
  findByProductId(productId: string) {
    const cartItem = [...cartItemsDB.values()].find(
      (cardItem) => cardItem.productId === productId,
    );

    if (cartItem) return cartItem;

    return undefined;
  },

  deleteById(cartItemId: string) {
    return cartItemsDB.delete(cartItemId);
  },

  deleteByProductId(productId: string) {
    const cartItem = [...cartItemsDB.values()].find(
      (cardItem) => cardItem.productId === productId,
    );

    if (cartItem) cartItemsDB.delete(cartItem.cartItemId);
  },
};
