import CartItem from '../model/CartItem.js';
import { Coupon } from '../model/Coupon.js';
import Order from '../model/Order.js';
import Product from '../model/Product.js';

export const products: Product[] = [];
export const cartItems: CartItem[] = [];
export const orders: Order[] = [];

const NO_TIME_LIMIT: Coupon['availableTime'] = { startTime: '', endTime: '' };

export const coupons: Coupon[] = [
  {
    id: 1,
    code: 'FIXED5000',
    name: '5,000원 할인 쿠폰',
    type: 'FIXED',
    dueDate: '2026-11-30',
    minOrderAmount: 100_000,
    availableTime: NO_TIME_LIMIT,
    value: 5_000,
  },
  {
    id: 2,
    code: 'BOGO',
    name: '2개 구매 시 추가 1개 무료 쿠폰',
    type: 'BOGO',
    dueDate: '2026-06-30',
    minOrderAmount: 0,
    availableTime: NO_TIME_LIMIT,
    value: 0,
  },
  {
    id: 3,
    code: 'FREESHIPPING',
    name: '5만원 이상 구매 시 무료 배송 쿠폰',
    type: 'FREE_SHIPPING',
    dueDate: '2026-08-31',
    minOrderAmount: 50_000,
    availableTime: NO_TIME_LIMIT,
    value: 0,
  },
  {
    id: 4,
    code: 'MIRACLESALE',
    name: '미라클모닝 30% 할인 쿠폰',
    type: 'PERCENTAGE',
    dueDate: '2026-07-31',
    minOrderAmount: 0,
    availableTime: { startTime: '04:00', endTime: '07:00' },
    value: 30,
  },
];
