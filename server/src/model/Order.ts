import AppError from '../errors/AppError.js';

export type OrderItemType = {
  id: number;
  orderCount: number;
};

export default class Order {
  constructor(
    private id: number,
    private orderItems: OrderItemType[],
    private isRemoteArea: boolean = false,
    private coupons: number[] = [],
  ) {
    this.validateOrderItems();
  }

  toJson() {
    return {
      id: this.id,
      orderItems: this.orderItems,
      isRemoteArea: this.isRemoteArea,
      coupons: this.coupons,
    };
  }

  private validateOrderItems() {
    if (!this.orderItems || this.orderItems.length === 0) {
      throw new AppError('EMPTY_SELECTED_PRODUCTS');
    }
  }
}
