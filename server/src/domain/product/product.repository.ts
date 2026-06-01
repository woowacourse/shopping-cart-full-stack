import { products } from '../../db/inMemoryDb.js';
import Product, { ProductType } from '../../model/Product.js';

export interface ProductRepository {
  get: () => Product[];
  add: (product: Product) => void;
  delete: (id: number) => void;
  nextId: () => number;
}

export class InMemoryProductRepository implements ProductRepository {
  get() {
    return [...products];
  }

  add(product: Product) {
    products.push(product);
  }

  delete(id: number) {
    const index = products.findIndex((p) => p.toJson().id === id);
    if (index !== -1) products.splice(index, 1);
  }

  nextId() {
    const lastId = products.length + 1;
    return lastId;
  }
}
