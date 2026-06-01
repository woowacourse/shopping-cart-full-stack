import {cartItems} from '../db.js';
import {HttpError} from '../middlewares/errorHandler.js';

export const cartService = {
  getCartItems() {
    return cartItems.findAll();
  },

  updateQuantity(id: string, quantity: number) {
    try {
      const updatedCartItem = cartItems.updateQuantity(id, quantity);

      if (!updatedCartItem) {
        throw new HttpError(404);
      }

      return updatedCartItem.getQuantity();
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }

      if (error instanceof Error) {
        throw new HttpError(400, error.message);
      }

      throw error;
    }
  },

  deleteCartItem(id: string) {
    const isDeleted = cartItems.deleteById(id);

    if (!isDeleted) {
      throw new HttpError(404);
    }
  },
};
