export default class ShoppingCart {
  private id: string;
  private quantity: number;

  constructor({ id, quantity }: { id: string; quantity: number }) {
    this.id = id;
    this.quantity = quantity;
  }

  getShoppingCart() {
    return { id: this.id, quantity: this.quantity };
  }
}
