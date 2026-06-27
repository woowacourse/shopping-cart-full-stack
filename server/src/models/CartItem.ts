export class CartItem {
  constructor(
    public readonly id: string,
    public readonly productId: string,
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
      productId: this.productId,
      quantity: this.quantity,
    };
  }
}
