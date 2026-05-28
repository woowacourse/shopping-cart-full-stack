import type { ProductData } from "../models/Product.js";

export interface DBInterface {
  PRODUCT_TABLE: Map<number, ProductData>;
  CART_TABLE: Map<number, unknown>;
}

export const DB = {
  PRODUCT_TABLE: new Map<number, ProductData>(),
  CART_TABLE: new Map(),
};
