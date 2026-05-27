import {products} from '../db.js';
import {Product} from '../models/Product.js';
import type {CreateProductRequestBody} from '../type.js';

export const productService = {
  getProducts() {
    return products.getAll();
  },

  createProduct({name, price, imageUrl}: CreateProductRequestBody) {
    if (products.hasName(name)) {
      return null;
    }

    const newId = products.getNextId();

    products.add(new Product(newId, name, price, imageUrl));

    return newId;
  },

  deleteProduct(id: string) {
    return products.deleteById(id);
  },
};
