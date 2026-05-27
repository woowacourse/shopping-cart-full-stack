class StorageHandler<Storage> {
  #storage: Storage;

  constructor(storage: Storage) {
    this.#storage = storage;
  }

  getItem(table: string, id: string) {
    return this.#storage.getItem(table, id);
  }

  addItem<T>(table: string, id: string, obj: T) {
    return this.#storage.addItem(table, id, obj);
  }

  updateItem<T>(table: string, id: string, obj: T) {
    return this.#storage.updateItem(table, id, obj);
  }

  deleteItem(table: string, id: string) {
    return this.#storage.deleteItem(table, id);
  }

  allItems(table: string) {
    return this.#storage.allItems(table);
  }

  clearAllItems(table: string) {
    return this.#storage.clearAllItems(table);
  }
}

export default StorageHandler;
