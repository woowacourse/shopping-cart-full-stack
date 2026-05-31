import { productsDB } from '../../db.js';
import { ProductRepository } from '../../interfaces/repository.interface.js';
import type { Product } from './product.model.js';

export const productRepository: ProductRepository = {
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
