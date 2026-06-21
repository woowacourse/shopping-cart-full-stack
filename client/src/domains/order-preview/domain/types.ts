import type {CouponId} from '../../coupon/domain/types.js';

export interface AppliedCoupon {
  couponId: CouponId;
  code: string;
  name: string;
  discountAmount: number;
}

export interface ExcludedCoupon {
  couponId: CouponId;
  code: string;
  name: string;
  excludedReason: string;
}

export interface OrderPrice {
  orderAmount: number;
  productDiscountAmount: number;
  shippingDiscountAmount: number;
  totalDiscountAmount: number;
  shippingFee: number;
  totalPaymentAmount: number;
}

export interface BenefitItem {
  productId: string;
  quantity: number;
}

export interface PreviewOrder {
  price: OrderPrice;
  appliedCoupons: AppliedCoupon[];
  excludedCoupons: ExcludedCoupon[];
  benefitItems: BenefitItem[];
}
