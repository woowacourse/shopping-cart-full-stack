import { Order } from "./Order";
import { OrderRepositoryInterface } from "./interfaces/OrderRepositoryInterface";

export default class InMemoryOrderRepository implements OrderRepositoryInterface {
  #orders: Map<number, Order>;
  #nextId: number;

  constructor() {
    this.#orders = new Map();
    this.#nextId = 1;
  }

  save(orderData: Omit<Order, "orderId">): Order {
    const orderId = this.#nextId++;
    const newOrder: Order = {
      orderId,
      ...orderData,
    };

    this.#orders.set(orderId, newOrder);

    return newOrder;
  }

  findById(orderId: number): Order | null {
    const order = this.#orders.get(orderId);
    if (!order) return null;

    return { ...order };
  }
}
