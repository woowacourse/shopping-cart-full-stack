import Product from "../models/Product.js";
import Cart from "../models/Cart.js";
import { Storage } from "./Storage.js";
import { MY_CART_ID } from "../constanst.js";

const defaultData = {
  products: new Map<string, Product>(),
  cart: new Map<string, Cart>([[MY_CART_ID, new Cart()]]),
};

class InMemoryStorage implements Storage {
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
