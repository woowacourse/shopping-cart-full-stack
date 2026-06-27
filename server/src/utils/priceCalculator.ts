import {
  OrderContext,
  CouponDiscountResult,
  CouponPolicy,
  CouponContext,
} from '../interfaces/couponPolicy.interface.js';
import { createCouponCombinations } from './couponCombination.js';

export const priceCalculator = {
  // 1. 총 주문 금액 계산
  calculateOrderPrice(context: OrderContext) {
    return context.orderProducts.reduce((sum, product) => {
      return sum + product.productPrice * product.quantity;
    }, 0);
  },

  // 2. 총 배달비 계산
  calculateDeliveryFee(context: OrderContext) {
    const defaultFee = this.calculateOrderPrice(context) < 100000 ? 3000 : 0;
    const isIslandFee = context.isIsland ? 3000 : 0;

    return defaultFee + isIslandFee;
  },

  // 3. 최적의 할인 금액 계산 + 선택된 쿠폰 Ids
  calculateBestCouponDiscount(
    context: OrderContext,
    coupons: CouponPolicy[],
  ): CouponDiscountResult {
    const couponContext = this.createCouponContext(context);
    const combinations = createCouponCombinations(couponContext, coupons);

    return combinations.reduce((bestDiscount, combination) => {
      const currentDiscount = this.calculateCouponDiscount(
        couponContext,
        combination,
      );

      const currentTotalDiscountPrice =
        currentDiscount.productDiscountPrice +
        currentDiscount.deliveryDiscountPrice;

      const bestTotalDiscountPrice =
        bestDiscount.productDiscountPrice + bestDiscount.deliveryDiscountPrice;

      if (currentTotalDiscountPrice <= bestTotalDiscountPrice) {
        return bestDiscount;
      }

      return currentDiscount;
    }, this.calculateCouponDiscount(couponContext, []));
  },

  // 4. 유저 선택에 의한 할인 금액 계산
  calculateSelectedCouponDiscount(
    context: OrderContext,
    selectedCoupons: CouponPolicy[],
  ): CouponDiscountResult {
    const couponContext = this.createCouponContext(context);
    // TODO: 유효한지 체크 후 에러 던지기

    return this.calculateCouponDiscount(couponContext, selectedCoupons);
  },

  // 할인된 상품 금액, 할인된 배송비 금액, 적용된 쿠폰 Ids 계산
  calculateCouponDiscount(
    context: CouponContext,
    coupons: CouponPolicy[],
  ): CouponDiscountResult {
    const productDiscountPrice = this.calculateProductDiscountPrice(
      context,
      coupons,
    );
    const deliveryDiscountPrice = this.calculateDeliveryDiscountPrice(
      context,
      coupons,
    );

    return {
      couponIds: coupons.map((coupon) => coupon.couponId),
      productDiscountPrice,
      deliveryDiscountPrice,
    };
  },

  // 상품 할인 금액 계산
  calculateProductDiscountPrice(
    context: CouponContext,
    coupons: CouponPolicy[],
  ) {
    // 정액, 정율 쿠폰 분리
    const fixedDiscountCoupons = coupons.filter(
      (coupon) => coupon.discountType === 'FIXED',
    );
    const rateDiscountCoupons = coupons.filter(
      (coupon) => coupon.discountType === 'RATE',
    );

    // 정액 쿠폰 먼저 적용
    const fixedDiscountPrice = fixedDiscountCoupons.reduce((sum, coupon) => {
      const discount = coupon.calculateDiscount(context);

      return sum + discount.productDiscountPrice;
    }, 0);

    // 정액 쿠폰 할인을 적용한 후의 주문 금액
    const priceAfterFixedDiscount = Math.max(
      this.calculateOrderPrice(context) - fixedDiscountPrice,
      0,
    );

    const rateDiscountPrice = rateDiscountCoupons.reduce((sum, coupon) => {
      const rateContext = {
        ...context,
        orderPrice: Math.max(priceAfterFixedDiscount - sum, 0),
      };

      const discount = coupon.calculateDiscount(rateContext);

      return sum + discount.productDiscountPrice;
    }, 0);

    return Math.min(
      fixedDiscountPrice + rateDiscountPrice,
      this.calculateOrderPrice(context),
    );
  },
  // 배송비 할인 금액 계산
  calculateDeliveryDiscountPrice(
    context: CouponContext,
    coupons: CouponPolicy[],
  ) {
    const deliveryDiscountCoupons = coupons.filter(
      (coupon) => coupon.discountType === 'DELIVERY',
    );

    return deliveryDiscountCoupons.reduce((sum, coupon) => {
      return sum + coupon.calculateDiscount(context).deliveryDiscountPrice;
    }, 0);
  },

  // CouponContext 주입을 위한 helper
  createCouponContext(context: OrderContext): CouponContext {
    const orderPrice = priceCalculator.calculateOrderPrice(context);
    const deliveryFee = priceCalculator.calculateDeliveryFee(context);

    return {
      ...context,
      orderPrice,
      deliveryFee,
    };
  },
};
