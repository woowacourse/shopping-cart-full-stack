export default class ShoppingCart {
  private id: string;
  private quantity: number;

  constructor({ id, quantity }: { id: string; quantity: number }) {
    this.#validateQuantity(quantity);
    this.id = id;
    this.quantity = quantity;
  }

  #validateQuantity(quantity: number) {
    if (quantity < 1) throw new Error('상품 수량이 1 이상이어야 합니다.');
  }

  getShoppingCart() {
    return { id: this.id, quantity: this.quantity };
  }
}
