import type { ProductEntity } from "../features/product/product.entity.js";
import type { CartEntity } from "../features/cart/cart.entity.js";

export interface InMemoryDB {
  PRODUCT_TABLE: Map<number, ProductEntity>;
  CART_TABLE: CartEntity[];
}

export const db: InMemoryDB = {
  PRODUCT_TABLE: new Map(),
  CART_TABLE: [],
};
