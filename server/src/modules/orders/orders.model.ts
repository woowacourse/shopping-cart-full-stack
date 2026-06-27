import type { OrderProduct } from "./orders.dto.ts";

export class Order {
  id: number;
  products: OrderProduct[];
  couponIds: number[];
  isRemoteArea: boolean;
  deliveryFee: number;
  createdAt: Date;

  constructor({
    id,
    products,
    couponIds = [],
    isRemoteArea = false,
    deliveryFee = 0,
    createdAt = new Date(),
  }: {
    id: number;
    products: OrderProduct[];
    couponIds?: number[];
    isRemoteArea?: boolean;
    deliveryFee?: number;
    createdAt?: Date;
  }) {
    this.id = id;
    this.products = products;
    this.couponIds = couponIds;
    this.isRemoteArea = isRemoteArea;
    this.deliveryFee = deliveryFee;
    this.createdAt = createdAt;
  }
}
