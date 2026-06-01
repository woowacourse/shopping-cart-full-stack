import AppError from '../errors/AppError.js';

export type CartItemType = {
  id: number;
  orderCount: number;
};

export default class CartItem {
  constructor(
    private id: number,
    private orderCount: number,
  ) {
    this.validateOrderCount();
  }

  toJson() {
    return {
      id: this.id,
      orderCount: this.orderCount,
    };
  }

  private validateOrderCount() {
    if (!this.orderCount && this.orderCount !== 0) {
      throw new AppError('EMPTY_PRODUCT_ORDER_COUNT');
    }

    if (typeof this.orderCount === 'string' || this.orderCount < 1) {
      throw new AppError('INVALID_PRODUCT_ORDER_COUNT_TYPE');
    }
  }
}
