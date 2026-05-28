import { Storage } from "./Storage.js";
import { INITIAL_DATA } from "../data.js";

class InMemoryStorage implements Storage {
  #data: Record<string, any>;

  constructor() {
    this.#data = INITIAL_DATA;
  }

  getItem(table: string, id: string) {
    return this.#data[table].get(id);
  }

  addItem<T>(table: string, id: string, obj: T) {
    return this.#data[table].set(id, obj);
  }

  hasItem(table: string, id: string): boolean {
    return this.#data[table].has(id);
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
