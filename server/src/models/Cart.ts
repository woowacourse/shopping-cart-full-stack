class Cart {
  #items;
  constructor() {
    this.#items = new Map();
  }

  updateItemByProductId(productId: string, quantity: number) {
    this.#items.set(productId, quantity);
  }

  hasItemByProductId(productId: string) {
    return this.#items.has(productId);
  }

  deleteItemByProductId(productId: string) {
    return this.#items.delete(productId);
  }

  getAllItems() {
    const items = [];
    for (const key of this.#items.keys()) {
      items.push({ product_id: key, quantity: this.#items.get(key) });
    }
    return items;
  }
}

export default Cart;
