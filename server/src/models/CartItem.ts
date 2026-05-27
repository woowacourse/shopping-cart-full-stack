import {Product} from './Product.js';

export class CartItem {
  constructor(
    public readonly id: string,
    public readonly productInfo: Product,
    private quantity: number
  ) {}

  updateQuantity(quantity: number) {
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
}
