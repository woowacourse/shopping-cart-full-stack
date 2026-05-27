export default class ShoppingCart {
  private items = new Map<string, number>();

  add({ id, quantity }: { id: string; quantity: number }) {
    this.#validateQuantity(quantity);
    this.items.set(id, quantity);
  }

  #validateQuantity(quantity: number) {
    if (quantity < 1) throw new Error('상품 수량이 1 이상이어야 합니다.');
    if (quantity > 99) throw new Error('상품 수량이 99 이하여야 합니다.');
  }

  getShoppingCart() {
    return [...this.items.entries()].map(([productId, quantity]) => ({
      productId,
      quantity,
    }));
  }

  getQuantity(id: string) {
    return this.items.get(id);
  }

  setQuantity(id: string, quantity: number) {
    this.items.set(id, quantity);
  }
}
