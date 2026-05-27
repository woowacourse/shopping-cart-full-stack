export interface StorageHandlerType {
  getItem<T>(table: string, id: string): T | undefined;
  addItem<T>(table: string, id: string, obj: T): T;
  updateItem<T>(table: string, id: string, obj: T): T;
  deleteItem(table: string, id: string): void;
  allItems<T>(table: string): T[];
  clearAllItems(table: string): void;
}

class StorageHandler<Storage extends StorageHandlerType> {
  #storage: Storage;

  constructor(storage: Storage) {
    this.#storage = storage;
  }

  getItem<T>(table: string, id: string): T | undefined {
    return this.#storage.getItem<T>(table, id);
  }

  addItem<T>(table: string, id: string, obj: T): T {
    return this.#storage.addItem<T>(table, id, obj);
  }

  updateItem<T>(table: string, id: string, obj: T): T {
    return this.#storage.updateItem<T>(table, id, obj);
  }

  deleteItem(table: string, id: string): void {
    this.#storage.deleteItem(table, id);
  }

  allItems<T>(table: string): T[] {
    return this.#storage.allItems<T>(table);
  }

  clearAllItems(table: string): void {
    this.#storage.clearAllItems(table);
  }
}

export default StorageHandler;
