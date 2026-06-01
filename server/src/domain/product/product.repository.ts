import { products } from '../../db/inMemoryDb.js';
import Product from '../../model/Product.js';

export interface ProductRepository {
  get: () => void;
  add: (product: Product) => void;
  delete: (id: number) => void;
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
}
