import { Storage } from "./Storage.js";

class InMemoryStorage implements Storage {
  #data: Record<string, any>;

  constructor(initialData: () => Record<string, Map<string, unknown>>) {
    this.#data = initialData();
  }

  getItemById(table: string, id: string) {
    return this.#data[table].get(id);
  }

  addItemById<T>(table: string, id: string, obj: T) {
    return this.#data[table].set(id, obj);
  }

  hasItemById(table: string, id: string): boolean {
    return this.#data[table].has(id);
  }

  updateItemById<T>(table: string, id: string, obj: T) {
    return this.#data[table].set(id, obj);
  }

  deleteItemById(table: string, id: string) {
    return this.#data[table].delete(id);
  }

  allItems(table: string) {
    return [...this.#data[table].values()];
  }

  clearAllItems(table: string) {
    return (this.#data[table] = new Map());
  }
}

export default InMemoryStorage;
