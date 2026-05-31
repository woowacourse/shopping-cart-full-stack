import { cartItemsDB, productsDB } from '../../src/db.js';
import { Product } from '../../src/modules/products/product.model.js';

export const resetTestDatabase = () => {
  productsDB.clear();
  cartItemsDB.clear();
};

export const seedProduct = (productId: string, product: Product) => {
  productsDB.set(productId, product);
};
