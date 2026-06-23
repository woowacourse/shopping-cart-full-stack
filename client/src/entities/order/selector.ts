import type { Order } from './types';

export function getOrderProductCount(order: Order) {
  return order.products.reduce((total, product) => {
    return total + product.quantity;
  }, 0);
}
