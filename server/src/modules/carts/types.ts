import type { Product } from "@modules/products/types";

export type CartId = Product["id"];

export interface CartItem {
  product: Product;
  quantity: number;
}
