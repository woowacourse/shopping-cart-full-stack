import Product from "../models/Product.js";

const defaultData = {
  products: new Map<string, Product>(),
};

class InMemoryStorage {
  #data: Record<string, any>;

  constructor() {
    this.#data = { ...defaultData };
  }

  getItem(table: string, id: string) {
    return this.#data[table].get(id);
  }

  addItem<T>(table: string, id: string, obj: T) {
    return this.#data[table].set(id, obj);
  }

  updateItem<T>(table: string, id: string, obj: T) {
    return this.#data[table].set(id, obj);
  }

  deleteItem(table: string, id: string) {
    return this.#data[table].delete(id);
  }

  allItems(table: string) {
    return this.#data[table].values();
  }

  clearAllItems(table: string) {
    return (this.#data[table] = new Map());
  }
}

export default InMemoryStorage;
