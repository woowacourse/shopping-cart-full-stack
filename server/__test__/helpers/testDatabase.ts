import { cartItemsDB, ordersDB, productsDB } from '../../src/db.js';
import { Order } from '../../src/modules/orders/orders.model.js';
import { Product } from '../../src/modules/products/product.model.js';

export const resetTestDatabase = () => {
  productsDB.clear();
  cartItemsDB.clear();
  ordersDB.clear();
};

export const resetOrderDatabase = () => {
  ordersDB.clear();
};

export const seedProduct = (productId: string, product: Product) => {
  productsDB.set(productId, product);
};
export const seedOrder = (product: Product, quantity: number) => {
  const mockOrder = new Order({
    orderId: 'order-1',
    products: [{ productId: product.productId, quantity }],
    couponIds: [],
  });

  ordersDB.set(mockOrder.orderId, mockOrder);
};
