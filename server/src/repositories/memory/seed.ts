import { CartItem } from '../../models/CartItem.js';
import { Coupon } from '../../models/Coupon.js';
import { Product } from '../../models/Product.js';

export const createSeedProducts = (): Product[] => [
  new Product('1', 'EASTER', 100000000000, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop'),
  new Product('2', 'PARADI', 1, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop'),
  new Product('3', 'BIBIBING', 2000, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop'),
  new Product('4', 'ZO', 20000000, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop'),
  new Product('5', '6month', 2, 'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=200&h=200&fit=crop'),
];

export const createSeedCartItems = (): CartItem[] => [
  new CartItem('1', '1', 1),
  new CartItem('2', '2', 2),
  new CartItem('3', '5', 98),
];

export const createSeedCoupons = (): Coupon[] => [
  new Coupon('1', '5,000원 할인 쿠폰', 'FIXED5000', '2026-11-30'),
  new Coupon('2', '2개 구매 시 1개 무료 쿠폰', 'BOGO', '2026-06-30'),
  new Coupon('3', '5만원 이상 구매 시 무료 배송 쿠폰', 'FREESHIPPING', '2026-08-31'),
  new Coupon('4', '미라클모닝 30% 할인 쿠폰', 'MIRACLESALE', '2026-07-31'),
];
