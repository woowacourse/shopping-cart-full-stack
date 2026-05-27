export default class ShoppingCart {
  private items = new Map<string, number>();

  add({ productId, quantity }: { productId: string; quantity: number }) {
    this.#validateQuantity(quantity);
    this.items.set(productId, quantity);
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

  getQuantity(productId: string) {
    return this.items.get(productId);
  }

  setQuantity(productId: string, quantity: number) {
    this.#validateQuantity(quantity);
    this.items.set(productId, quantity);
  }

  deleteProduct(productId: string) {
    this.items.delete(productId);
  }
}
