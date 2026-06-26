import { Order } from "../Order";

export interface OrderRepositoryInterface {
  save(orderData: Omit<Order, "orderId">): Order;
  findById(orderId: number): Order | null;
}
