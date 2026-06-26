import CartService from './domain/cart/cart.service.js';
import { InMemoryCartRepository } from './domain/cart/cart.repository.js';
import CouponService from './domain/coupon/coupon.service.js';
import { InMemoryCouponRepository } from './domain/coupon/coupon.repository.js';
import OrderService from './domain/order/order.service.js';
import { InMemoryOrderRepository } from './domain/order/order.repository.js';
import ProductService from './domain/product/product.service.js';
import { InMemoryProductRepository } from './domain/product/product.repository.js';
import CartAppService from './domain/cart/cart.app-service.js';
import OrderAppService from './domain/order/order.app-service.js';
import ProductAppService from './domain/product/product.app-service.js';

const productService = new ProductService(new InMemoryProductRepository());
const cartService = new CartService(new InMemoryCartRepository());
const orderService = new OrderService(new InMemoryOrderRepository());
const couponService = new CouponService(new InMemoryCouponRepository());

export const productAppService = new ProductAppService(
  productService,
  cartService,
);
export const cartAppService = new CartAppService(cartService, productService);
export const orderAppService = new OrderAppService(
  productService,
  orderService,
  couponService,
);
