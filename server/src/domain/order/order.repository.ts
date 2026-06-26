import AppError from '../../errors/AppError.js';
import { orders } from '../../db/inMemoryDb.js';
import Order from '../../model/Order.js';

type OrderFields = {
  isRemoteArea?: boolean;
  coupons?: number[];
};

export interface OrderRepository {
  findById: (id: number) => Order;
  add: (order: Order) => void;
  update: (id: number, fields: OrderFields) => Order;
  nextId: () => number;
}

export class InMemoryOrderRepository implements OrderRepository {
  private id = 0;

  findById(id: number) {
    const target = orders.find((order) => order.toJson().id === id);

    if (!target) throw new AppError('ORDER_NOT_EXIST');

    return target;
  }

  add(order: Order) {
    orders.push(order);
  }

  update(id: number, fields: OrderFields) {
    const index = orders.findIndex((order) => order.toJson().id === id);
    if (index === -1) throw new AppError('ORDER_NOT_EXIST');

    const current = orders[index].toJson();
    const updated = new Order(
      id,
      current.orderItems,
      fields.isRemoteArea ?? current.isRemoteArea,
      fields.coupons ?? current.coupons,
    );
    orders[index] = updated;

    return updated;
  }

  nextId() {
    return ++this.id;
  }
}
