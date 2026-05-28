class Cart {
  #items;
  constructor() {
    this.#items = new Map();
  }

  updateItem(productId: string, quantity: number) {
    return this.#items.set(productId, quantity);
  }

  hasItem(productId: string) {
    return this.#items.has(productId);
  }

  deleteItem(productId: string) {
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
