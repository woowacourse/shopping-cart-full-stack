import {Order} from './Order.js';

export class Orders {
  constructor(private orders: Order[] = []) {}

  add(order: Order) {
    this.orders.push(order);
  }

  findById(id: string) {
    return this.orders.find((order) => order.id === id);
  }
}
