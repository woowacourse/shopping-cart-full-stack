import { PreorderItem } from "@cart/shared";

export interface Preorder {
  preorderId: string; // UUID 예정
  items: PreorderItem[];
}
