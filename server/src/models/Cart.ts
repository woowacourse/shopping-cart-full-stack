class Cart {
  #items;
  constructor() {
    this.#items = new Map();
  }

  updateItem(id: string, quantity: number) {
    this.#items.set(id, quantity);
  }

  getItem(id: string) {
    return this.#items.get(id);
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
