import type {
  CouponBenefit,
  CouponCondition,
  Coupon as CouponType,
  ProductDiscountBenefit,
  ShippingDiscountBenefit,
} from '../types/coupon.js';

export type ProductDiscountCoupon = Coupon & {benefit: ProductDiscountBenefit};
export type ShippingDiscountCoupon = Coupon & {benefit: ShippingDiscountBenefit};

const PRODUCT_DISCOUNT_TYPE_PRIORITY = {
  FIXED: 0,
  RATE: 1,
} as const;

export class Coupon implements CouponType {
  public readonly id: number;
  public readonly code: string;
  public readonly name: string;
  public readonly expirationDate: Date;
  public readonly condition: CouponCondition;
  public readonly benefit: CouponBenefit;

  constructor({id, code, name, expirationDate, condition, benefit}: CouponType) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.expirationDate = expirationDate;
    this.condition = condition;
    this.benefit = benefit;
  }

  isExpired(now = new Date()) {
    return this.expirationDate < now;
  }

  isProductDiscount(): this is ProductDiscountCoupon {
    return this.benefit.target === 'PRODUCT';
  }

  isShippingDiscount(): this is ShippingDiscountCoupon {
    return this.benefit.target === 'SHIPPING';
  }

  getProductDiscountPriority(this: ProductDiscountCoupon) {
    return PRODUCT_DISCOUNT_TYPE_PRIORITY[this.benefit.discountType];
  }
}
