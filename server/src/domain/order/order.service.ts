import Order, { OrderItemType } from '../../model/Order.js';
import { OrderRepository } from './order.repository.js';

export default class OrderService {
  constructor(private orderRepository: OrderRepository) {}

  createOrder(orderItems: OrderItemType[]) {
    const id = this.orderRepository.nextId();
    const newOrder = new Order(id, orderItems);
    this.orderRepository.add(newOrder);

    return id;
  }

  getOrder(id: number) {
    return this.orderRepository.findById(id);
  }

  updateRemoteArea(id: number, isRemoteArea: boolean) {
    return this.orderRepository.update(id, { isRemoteArea });
  }

  updateCoupons(id: number, coupons: number[]) {
    return this.orderRepository.update(id, { coupons });
  }
}
