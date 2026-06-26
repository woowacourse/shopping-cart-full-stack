import type { PreorderItem } from "@cart/shared";

export interface Product {
  productId: number;
  name: string;
  price: number;
  thumbnailUrl: string;
}

export interface CartItem {
  cartItemId: number;
  quantity: number;
  product: Product;
}

export interface Preorder {
  preorderId: string;
  items: PreorderItem[];
}
