import type {PreorderItem} from '../types/preorder.js';

export class Order {
  constructor(
    public readonly id: string,
    public readonly items: PreorderItem[],
    public readonly totalAmount: number
  ) {}

  getItemCount() {
    return this.items.length;
  }

  getTotalQuantity() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalAmount() {
    return this.totalAmount;
  }
}
