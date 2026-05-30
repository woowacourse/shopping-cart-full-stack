import type { ProductType } from "../models/product.js";
import type { CartItem } from "../controllers/cart.controller.js";
export interface DBInterface {
  PRODUCT_TABLE: Map<number, ProductType>;
  CART_TABLE: Map<number, CartItem>;
}

export const DB = {
  PRODUCT_TABLE: new Map<number, ProductType>(),
  CART_TABLE: new Map<number, CartItem>(),
};
