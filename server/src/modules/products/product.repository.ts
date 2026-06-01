import { productsDB } from '../../db.js';
import type { Product } from './product.model.js';

export const productRepository = {
  save(product: Product) {
    productsDB.set(product.productId, product);
    return product;
  },

  findAll() {
    return Array.from(productsDB.values());
  },

  findById(productId: string) {
    return productsDB.get(productId);
  },

  deleteById(productId: string) {
    return productsDB.delete(productId);
  },
};

export type ProductRepository = typeof productRepository;
