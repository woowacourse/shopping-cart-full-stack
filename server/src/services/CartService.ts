import {cartItems} from '../db.js';
import {HttpError} from '../middlewares/errorHandler.js';

export const isValidQuantity = (quantity: unknown) => {
  return typeof quantity === 'number' && Number.isInteger(quantity) && quantity >= 1 && quantity <= 99;
};

export const cartService = {
  getCartItems() {
    return cartItems.findAll();
  },

  updateQuantity(id: string, quantity: number) {
    if (!isValidQuantity(quantity)) {
      throw new HttpError(400, '수량은 1 이상 99 이하의 정수여야 합니다.');
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
