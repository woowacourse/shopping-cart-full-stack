import type {PreorderItem} from '../types/preorder.js';
import type {BenefitItem} from '../types/order.js';

export class Order {
  constructor(
    public readonly id: string,
    public readonly items: PreorderItem[],
    public readonly benefitItems: BenefitItem[],
    public readonly totalAmount: number
  ) {}

  getItemCount() {
    return this.items.length;
  }

  getTotalQuantity() {
    const itemQuantity = this.items.reduce((total, item) => total + item.quantity, 0);
    const benefitItemQuantity = this.benefitItems.reduce((total, item) => total + item.quantity, 0);

    return itemQuantity + benefitItemQuantity;
  }

  getTotalAmount() {
    return this.totalAmount;
  }
}
