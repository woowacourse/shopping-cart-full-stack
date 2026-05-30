import {cartItems} from '../db.js';

type UpdateQuantityResult =
  | {
      status: 'updated';
      quantity: number;
    }
  | {
      status: 'notFound';
    }
  | {
      status: 'invalid';
      message: string;
    };

export const isValidQuantity = (quantity: unknown) => {
  return typeof quantity === 'number' && Number.isInteger(quantity) && quantity >= 1 && quantity <= 99;
};

export const cartService = {
  getCartItems() {
    return cartItems.findAll();
  },

  updateQuantity(id: string, quantity: number): UpdateQuantityResult {
    if (!isValidQuantity(quantity)) {
      return {
        status: 'invalid',
        message: '수량은 1 이상 99 이하의 정수여야 합니다.',
      };
    }

    const updatedCartItem = cartItems.updateQuantity(id, quantity);

    if (!updatedCartItem) {
      return {
        status: 'notFound',
      };
    }

    return {
      status: 'updated',
      quantity: updatedCartItem.getQuantity(),
    };
  },

  deleteCartItem(id: string) {
    return cartItems.deleteById(id);
  },
};
