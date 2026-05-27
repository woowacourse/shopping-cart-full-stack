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
}

export default Cart;
