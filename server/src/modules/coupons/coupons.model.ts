import {
  CouponContext,
  CouponDiscount,
  CouponPolicy,
} from '../../interfaces/couponPolicy.interface.js';

type FixedAmountCouponParams = {
  couponId: string;
  expiresAt: Date;
  minimumOrderPrice: number;
  discountPrice: number;
};
export class FixedAmountCoupon implements CouponPolicy {
  couponId;
  expiresAt;
  couponName = '5,000원 할인 쿠폰';
  couponDescription = '최소 주문 금액: 100,000원';
  type = 'FIXED_AMOUNT' as const;
  discountType = 'FIXED' as const;

  minimumOrderPrice;
  discountPrice;

  constructor(params: FixedAmountCouponParams) {
    this.couponId = params.couponId;
    this.expiresAt = params.expiresAt;

    this.minimumOrderPrice = params.minimumOrderPrice;
    this.discountPrice = params.discountPrice;
  }

  isApplicable(context: CouponContext) {
    return (
      context.now <= this.expiresAt &&
      context.orderPrice >= this.minimumOrderPrice
    );
  }
  calculateDiscount(context: CouponContext): CouponDiscount {
    return {
      productDiscountPrice: this.discountPrice,
      deliveryDiscountPrice: 0,
    };
  }
}

type BogoCouponParams = {
  couponId: string;
  expiresAt: Date;
  minimumQuantity: number;
};
export class BogoCoupon implements CouponPolicy {
  couponId;
  expiresAt;
  couponName = '2개 구매 시 1개 무료 쿠폰';
  couponDescription = '';

  type = 'BOGO' as const;
  discountType = 'FIXED' as const;

  minimumQuantity;

  constructor(params: BogoCouponParams) {
    this.couponId = params.couponId;
    this.expiresAt = params.expiresAt;
    this.minimumQuantity = params.minimumQuantity;
  }

  isApplicable(context: CouponContext) {
    const isCountThree = context.orderProducts.some(
      (product) => product.quantity >= this.minimumQuantity,
    );

    return context.now <= this.expiresAt && isCountThree;
  }
  calculateDiscount(context: CouponContext): CouponDiscount {
    const targetProducts = context.orderProducts.filter(
      (product) => product.quantity >= this.minimumQuantity,
    );

    const highestPrice = Math.max(
      ...targetProducts.map((product) => product.productPrice),
    );

    if (targetProducts.length === 0) {
      return {
        productDiscountPrice: 0,
        deliveryDiscountPrice: 0,
      };
    }
    return {
      productDiscountPrice: highestPrice,
      deliveryDiscountPrice: 0,
    };
  }
}

type FreeShippingCouponParams = {
  couponId: string;
  expiresAt: Date;
  minimumOrderPrice: number;
};
export class FreeShippingCoupon implements CouponPolicy {
  couponId;
  expiresAt;
  couponName = '5만원 이상 구매 시 무료 배송 쿠폰';
  couponDescription = '최소 주문 금액: 50,000원';
  type = 'FREE_SHIPPING' as const;
  discountType = 'DELIVERY' as const;
  minimumOrderPrice;

  constructor(params: FreeShippingCouponParams) {
    this.couponId = params.couponId;
    this.expiresAt = params.expiresAt;
    this.minimumOrderPrice = params.minimumOrderPrice;
  }

  isApplicable(context: CouponContext) {
    return (
      context.now <= this.expiresAt &&
      context.orderPrice >= this.minimumOrderPrice
    );
  }
  calculateDiscount(context: CouponContext): CouponDiscount {
    return {
      productDiscountPrice: 0,
      deliveryDiscountPrice: context.deliveryFee,
    };
  }
}

type MiracleSaleCouponParams = {
  couponId: string;
  expiresAt: Date;
  discountRate: number;
  startHour: number;
  endHour: number;
};
export class MiracleSaleCoupon implements CouponPolicy {
  couponId;
  expiresAt;
  couponName = '미라클모닝 30% 할인 쿠폰';
  couponDescription = '사용 가능 시간: 오전 4시부터 7시까지';
  type = 'RATE' as const;
  discountType = 'RATE' as const;
  discountRate;
  startHour;
  endHour;

  constructor(params: MiracleSaleCouponParams) {
    this.couponId = params.couponId;
    this.expiresAt = params.expiresAt;
    this.discountRate = params.discountRate;
    this.startHour = params.startHour;
    this.endHour = params.endHour;
  }

  isApplicable(context: CouponContext) {
    const currentHour = context.now.getHours();

    return (
      context.now <= this.expiresAt &&
      currentHour >= this.startHour &&
      currentHour < this.endHour
    );
  }
  calculateDiscount(context: CouponContext): CouponDiscount {
    return {
      productDiscountPrice: context.orderPrice * this.discountRate,
      deliveryDiscountPrice: 0,
    };
  }
}
