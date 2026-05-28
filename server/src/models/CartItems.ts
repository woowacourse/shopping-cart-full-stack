import {CartItem} from './CartItem.js';

export class CartItems {
  constructor(private cartItems: Array<CartItem>) {}

  getAll() {
    return [...this.cartItems];
  }

  findById(id: string) {
    return this.cartItems.find((cartItem) => cartItem.id === id);
  }

  updateQuantity(id: string, quantity: number) {
    const cartItem = this.findById(id);

    if (!cartItem) {
      return null;
    }

    cartItem.updateQuantity(quantity);
    return cartItem;
  }

  deleteById(id: string) {
    const targetIndex = this.cartItems.findIndex((cartItem) => cartItem.id === id);

    if (targetIndex === -1) {
      return false;
    }

    this.cartItems.splice(targetIndex, 1);
    return true;
  }

  deleteByProductId(id: string) {
    const targetIndex = this.cartItems.findIndex((cartItem) => cartItem.productInfo.id === id);

    if (targetIndex === -1) {
      return false;
    }

    this.cartItems.splice(targetIndex, 1);
    return true;
  }
}
