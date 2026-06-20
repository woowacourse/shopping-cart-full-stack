import {cartItems} from '../repositories/index.js';
import {HttpError} from '../middlewares/errorHandler.js';
import {INVALID_QUANTITY_MESSAGE, isValidQuantity} from '../domain/cartPolicy.js';

export const cartService = {
  getCartItems() {
    return cartItems.findAll();
  },

  updateQuantity(id: string, quantity: number) {
    if (!isValidQuantity(quantity)) {
      throw new HttpError(400, INVALID_QUANTITY_MESSAGE);
    }

    const updatedCartItem = cartItems.updateQuantity(id, quantity);

    if (!updatedCartItem) {
      throw new HttpError(404);
    }

    return updatedCartItem.getQuantity();
  },

  deleteCartItem(id: string) {
    const isDeleted = cartItems.deleteById(id);

    if (!isDeleted) {
      throw new HttpError(404);
    }
  },
};
