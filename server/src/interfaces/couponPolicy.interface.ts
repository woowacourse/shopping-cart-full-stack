export type CouponType = 'FIXED_AMOUNT' | 'BOGO' | 'FREE_SHIPPING' | 'RATE';

export type DiscountCouponType = 'FIXED' | 'RATE' | 'DELIVERY';

export type OrderProduct = {
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
};

// 기본 주문 타입
export type OrderContext = {
  orderProducts: OrderProduct[];
  isIsland: boolean;
  now: Date;
};

// 쿠폰 타입
export type CouponContext = OrderContext & {
  orderPrice: number;
  deliveryFee: number;
};

// 쿠폰 할인 정보 타입
export type CouponDiscount = {
  productDiscountPrice: number;
  deliveryDiscountPrice: number;
};

// 최대 조합 반환 타입
export type CouponDiscountResult = CouponDiscount & {
  couponIds: string[];
};

export interface CouponPolicy {
  couponId: string;
  couponName: string;
  couponDescription: string;

  expiresAt: Date;
  type: CouponType;
  discountType: DiscountCouponType;

  isApplicable(context: CouponContext): boolean;
  calculateDiscount(context: CouponContext): CouponDiscount;
}
