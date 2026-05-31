import type { ProductEntity } from "../features/product/product.entity.js";
import type { CartEntity } from "../features/cart/cart.entity.js";

export interface InMemoryDB {
  PRODUCT_TABLE: ProductEntity[];
  CART_TABLE: CartEntity[];
}

export const DB: InMemoryDB = {
  PRODUCT_TABLE: [],
  CART_TABLE: [],
};
