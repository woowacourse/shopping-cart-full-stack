import { CouponPolicy } from './interfaces/couponPolicy.interface.js';
import { CartItem } from './modules/cart/cartItem.model.js';
import {
  BogoCoupon,
  FixedAmountCoupon,
  FreeShippingCoupon,
  MiracleSaleCoupon,
} from './modules/coupons/coupons.model.js';
import { Order } from './modules/orders/orders.model.js';
import { Product } from './modules/products/product.model.js';

export const productsDB = new Map<string, Product>();

export const cartItemsDB = new Map<string, CartItem>();

export const ordersDB = new Map<string, Order>();

export const couponDB = new Map<string, CouponPolicy>([
  [
    'FIXED5000',
    new FixedAmountCoupon({
      couponId: 'FIXED5000',
      expiresAt: new Date('2026-11-30T23:59:59'),
      minimumOrderPrice: 100000,
      discountPrice: 5000,
    }),
  ],
  [
    'BOGO',
    new BogoCoupon({
      couponId: 'BOGO',
      expiresAt: new Date('2026-06-30T23:59:59'),
      minimumQuantity: 3,
    }),
  ],
  [
    'FREESHIPPING',
    new FreeShippingCoupon({
      couponId: 'FREESHIPPING',
      expiresAt: new Date('2026-08-31T23:59:59'),
      minimumOrderPrice: 50000,
    }),
  ],
  [
    'MIRACLESALE',
    new MiracleSaleCoupon({
      couponId: 'MIRACLESALE',
      expiresAt: new Date('2026-07-31T23:59:59'),
      discountRate: 0.3,
      startHour: 4,
      endHour: 7,
    }),
  ],
]);
