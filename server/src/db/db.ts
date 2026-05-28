import type { ProductData } from "../models/Product.js";
import type { CartItem } from "../controllers/CartController.js";
export interface DBInterface {
  PRODUCT_TABLE: Map<number, ProductData>;
  CART_TABLE: Map<number, CartItem>;
}

export const DB = {
  PRODUCT_TABLE: new Map<number, ProductData>(),
  CART_TABLE: new Map<number, CartItem>(),
};
