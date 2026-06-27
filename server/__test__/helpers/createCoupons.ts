import {
  CouponContext,
  OrderContext,
} from '../../src/interfaces/couponPolicy.interface.js';
import {
  BogoCoupon,
  FixedAmountCoupon,
  FreeShippingCoupon,
  MiracleSaleCoupon,
} from '../../src/modules/coupons/coupons.model.js';
import { priceCalculator } from '../../src/utils/priceCalculator.js';

export const createFixedAmountCoupon = (expiresAt = new Date('2026-11-30')) =>
  new FixedAmountCoupon({
    couponId: 'coupon-5000',
    expiresAt,
    minimumOrderPrice: 100000,
    discountPrice: 5000,
  });

export const createBogoCoupon = (expiresAt = new Date('2026-06-30')) =>
  new BogoCoupon({
    couponId: 'coupon-bogo',
    expiresAt,
    minimumQuantity: 3,
  });

export const createFreeShippingCoupon = (expiresAt = new Date('2026-08-31')) =>
  new FreeShippingCoupon({
    couponId: 'coupon-free-shipping',
    expiresAt,
    minimumOrderPrice: 50000,
  });

export const createMiracleSaleCoupon = (expiresAt = new Date('2026-07-31')) =>
  new MiracleSaleCoupon({
    couponId: 'coupon-miracle-sale',
    expiresAt,
    discountRate: 0.3,
    startHour: 4,
    endHour: 7,
  });

export const createContext = ({
  orderProducts = [
    {
      productId: 'product-1',
      productName: '상품A',
      productPrice: 100000,
      quantity: 3,
    },
  ],
  isIsland = false,
  now = new Date('2026-06-14T06:00:00'),
}: Partial<OrderContext> = {}): OrderContext => ({
  orderProducts,
  isIsland,
  now,
});

export const createCouponContext = (
  params: Partial<CouponContext> = {},
): CouponContext => {
  return priceCalculator.createCouponContext(createContext(params));
};
