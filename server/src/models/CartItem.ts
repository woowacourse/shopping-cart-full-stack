import {Product} from './Product.js';

export const isValidQuantity = (quantity: unknown) => {
  return typeof quantity === 'number' && Number.isInteger(quantity) && quantity >= 1 && quantity <= 99;
};

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
      throw new Error('수량은 1 이상 99 이하의 정수여야 합니다.');
    }
  }
}
