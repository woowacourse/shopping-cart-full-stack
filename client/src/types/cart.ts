import type { ProductType } from "./product";

export interface CartItemType {
  product: ProductType;
  quantity: number;
}

export interface OrderCheckInfo {
  selectedCount: number;
  totalQuantity: number;
  totalAmount: number;
  products: { id: number; quantity: number }[];
}
