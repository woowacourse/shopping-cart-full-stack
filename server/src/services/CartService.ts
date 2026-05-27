import {cartItems} from '../db.js';

export const cartService = {
  getCartItems() {
    return cartItems.getAll();
  },

  updateQuantity(id: string, quantity: number) {
    return cartItems.updateQuantity(id, quantity);
  },

  deleteCartItem(id: string) {
    return cartItems.deleteById(id);
  },
};
