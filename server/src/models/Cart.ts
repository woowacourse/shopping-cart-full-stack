class Cart {
  #items;
  constructor() {
    this.#items = new Map();
  }

  updateItem(productId: string, quantity: number) {
    this.#items.set(productId, quantity);
  }

  getItem(productId: string) {
    return this.#items.get(productId);
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
