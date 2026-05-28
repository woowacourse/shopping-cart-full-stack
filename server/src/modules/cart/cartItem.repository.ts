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

  deleteById(cartItemId: string) {
    return cartItemsDB.delete(cartItemId);
  },

  deleteByProductId(productId: string) {
    for (const cartItem of cartItemsDB.values()) {
      if (cartItem.productId === productId) {
        cartItemsDB.delete(cartItem.cartItemId);
      }
    }
  },
};
