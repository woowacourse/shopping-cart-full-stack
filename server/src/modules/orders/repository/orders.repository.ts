import { OrdersDB, OrderInfo } from "../types";

export interface OrderRepository {
  getOrders(): OrdersDB[];
  createOrder(order: OrderInfo): OrdersDB;
  updateOrder(orderId: string, order: OrderInfo): OrdersDB;
  clear(): void;
}

export class InMemoryOrderRepository implements OrderRepository {
  private orderDB: Map<string, OrdersDB> = new Map();

  private createId(): string {
    return crypto.randomUUID();
  }

  getOrders() {
    const orders = [...this.orderDB.values()];

    return orders;
  }

  createOrder(order: OrderInfo) {
    this.orderDB.clear();

    const orderId = this.createId();

    const newOrder = {
      orderId,
      ...order,
    };

    this.orderDB.set(orderId, newOrder);

    return newOrder;
  }

  updateOrder(orderId: string, order: OrderInfo) {
    const updated = { orderId, ...order };
    this.orderDB.set(orderId, updated);
    return updated;
  }

  clear() {
    this.orderDB.clear();
  }
}
