import { CartItem } from '../modules/cart/cartItem.model.js';
import { Order } from '../modules/orders/orders.model.js';
import { Product } from '../modules/products/product.model.js';
import { CouponPolicy } from './couponPolicy.interface.js';

export type ProductRepository = {
  save(product: Product): Product;
  findAll(): Product[];
  findById(productId: string): Product | undefined;
  deleteById(productId: string): boolean;
};

export type CartItemRepository = {
  save(cartItem: CartItem): CartItem;
  findAll(): CartItem[];
  findById(cartItemId: string): CartItem | undefined;
  findByProductId(productId: string): CartItem | undefined;
  deleteById(cartItemId: string): boolean;
  deleteByProductId(productId: string): void;
};

export type OrderRepository = {
  save(order: Order): Order;
  findAll(): Order[];
  findById(orderId: string): Order | undefined;
};

export type CouponRepository = {
  findAll(): CouponPolicy[];
  findByIds(couponId: string[]): CouponPolicy[] | undefined;
};
