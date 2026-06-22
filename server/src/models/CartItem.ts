import {INVALID_QUANTITY_MESSAGE, isValidQuantity} from '../domain/cart/cartPolicy.js';
import {Product} from './Product.js';

export class CartItem {
  constructor(
    public readonly id: string,
    public readonly productInfo: Product,
    private quantity: number
  ) {
    this.validateQuantity(quantity);
  }

  updateQuantity(quantity: number) {
    this.validateQuantity(quantity);

    this.quantity = quantity;
  }

  getQuantity() {
    return this.quantity;
  }

  toJSON() {
    return {
      id: this.id,
      productInfo: this.productInfo,
      quantity: this.quantity,
    };
  }

  private validateQuantity(quantity: number) {
    if (!isValidQuantity(quantity)) {
      throw new Error(INVALID_QUANTITY_MESSAGE);
    }
  }
}
