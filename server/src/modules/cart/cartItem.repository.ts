import { userDB } from '../../db.js';
import { CartItem } from './cartItem.model.js';

export const cartItemRepository = {
  save(cartItem: CartItem) {
    userDB[0].cartItemsDB.set(cartItem.cartItemId, cartItem);
    return cartItem;
  },

  findAll() {
    return Array.from(userDB[0].cartItemsDB.values());
  },

  findById(cartItemId: string) {
    return userDB[0].cartItemsDB.get(cartItemId);
  },

  deleteById(cartItemId: string) {
    return userDB[0].cartItemsDB.delete(cartItemId);
  },
};
