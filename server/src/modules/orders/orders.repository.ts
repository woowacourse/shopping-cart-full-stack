import { ordersDB } from '../../db.js';
import { OrderRepository } from '../../interfaces/repository.interface.js';
import { Order } from './orders.model.js';

export const orderRepository: OrderRepository = {
  save(order: Order) {
    ordersDB.set(order.orderId, order);
    return order;
  },

  findAll() {
    return Array.from(ordersDB.values());
  },

  findById(orderId: string) {
    return ordersDB.get(orderId);
  },
};
