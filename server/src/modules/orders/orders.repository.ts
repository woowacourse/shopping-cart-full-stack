import { Order } from "./orders.model.ts";
import type { OrderProduct } from "./orders.dto.ts";
import { rawOrders } from "../../raw/raw.orders.ts";

export const create = (products: OrderProduct[], couponIds: number[]): Order => {
  const id = (rawOrders.at(-1)?.id ?? 0) + 1;
  const newOrder = new Order({ id, products, couponIds });
  rawOrders.push(newOrder);
  return newOrder;
};

export const findById = (id: number): Order | undefined => {
  const rawOrder = rawOrders.find((order) => order.id === id);
  return rawOrder ? new Order(rawOrder) : undefined;
};

export const update = (
  id: number,
  data: { couponIds?: number[]; isRemoteArea?: boolean; deliveryFee?: number }
): Order | undefined => {
  const orderIndex = rawOrders.findIndex((order) => order.id === id);
  if (orderIndex === -1) return undefined;

  const rawOrder = rawOrders[orderIndex];
  if (data.couponIds !== undefined) rawOrder.couponIds = data.couponIds;
  if (data.isRemoteArea !== undefined) rawOrder.isRemoteArea = data.isRemoteArea;
  if (data.deliveryFee !== undefined) rawOrder.deliveryFee = data.deliveryFee;

  return new Order(rawOrder);
};

// For testing purposes
export const clear = () => {
  rawOrders.splice(0, rawOrders.length);
};
