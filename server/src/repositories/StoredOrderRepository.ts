import { StoredOrder } from "./StoredOrder";

export default class StoredOrderRepository {
  // StoredOrders의 데이터를 담고 있는 private 변수
  // Map 형태에 넣어주기 위한 index로 nextId
  #storedOrders: Map<number, StoredOrder>;
  #nextId: number;

  constructor() {
    this.#storedOrders = new Map();
    this.#nextId = 1;
  }

  getStoredOrders(): StoredOrder[] {
    return [...this.#storedOrders.values()];
  }

  findById(orderId: number): StoredOrder | null {
    return this.#storedOrders.get(orderId) ?? null;
  }

  addOrder(data: Omit<StoredOrder, "orderId">): StoredOrder {
    const order = { ...data, orderId: this.#nextId };
    this.#storedOrders.set(this.#nextId, order);
    this.#nextId++;
    return order;
  }

  deleteById(orderId: number): void {
    this.#storedOrders.delete(orderId);
  }

  clear(): void {
    this.#storedOrders.clear();
    this.#nextId = 1;
  }
}

export const storedOrderRepository = new StoredOrderRepository();
