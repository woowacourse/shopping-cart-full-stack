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
    };

const isValidQuantity = (quantity: unknown) => {
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
