import { CalculatedPrice, GiftItem, PreorderItem } from "@cart/shared";

export interface OrderItemSnapshot extends PreorderItem {
}

export interface Order {
  orderId: number;
  items: OrderItemSnapshot[];
  priceSummary: CalculatedPrice;
  giftItems: GiftItem[];
}
