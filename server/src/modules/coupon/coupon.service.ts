import AppError from "../../errors/AppError.js";
import { CheckoutItem } from "../checkout/Checkout.js";
import { CouponItem } from "./Coupon.js";
import { mockCouponData } from "./coupon.mock.js";
import { CouponRepository } from "./coupon.repository.js";

class CouponService {
  constructor(private couponRepository: CouponRepository) {}

  createCoupon({
    baseInformation,
    discountPolicy,
    condition,
  }: Omit<CouponItem, "id">) {
    const newCoupon = this.couponRepository.create({
      baseInformation,
      discountPolicy,
      condition,
    });

    return newCoupon.toJson().id;
  }

  getCoupons(checkoutItems: CheckoutItem[], requestedAt: Date) {
    const coupons = this.couponRepository.getCouponList();

    return coupons.map((coupon) => {
      const isAvailable = coupon.isAvailable({ checkoutItems, requestedAt });
      return {
        ...coupon.toJson(),
        isAvailable,
      };
    });
  }

  getTotalDiscountPrice(
    couponIds: [number?, number?],
    orderPrice: number,
    checkoutItems: CheckoutItem[],
    deliveryFee: number,
  ) {
    const coupons = couponIds
      .filter((couponId) => couponId !== undefined)
      .map((couponId) => {
        const coupon = this.couponRepository.findById(couponId);

        if (!coupon) {
          throw new AppError("COUPON_NOT_FOUND");
        }

        return coupon;
      });

    // 정액쿠폰 먼저 적용하도록 정렬
    coupons.sort((a, b) => {
      if (a.getDiscountType() === b.getDiscountType()) {
        return 0;
      }

      return a.getDiscountType() === "fixed" ? -1 : 1;
    });

    let targetPrice = orderPrice;
    let totalDiscountPrice = 0;

    coupons.forEach((coupon) => {
      const discountPrice = coupon.getDiscountAmount({
        targetPrice,
        checkoutItems,
        deliveryFee,
      });
      targetPrice -= discountPrice;
      totalDiscountPrice += discountPrice;
    });

    return totalDiscountPrice;
  }

  getDiscountPrice(
    couponId: number,
    orderPrice: number,
    checkoutItems: CheckoutItem[],
    deliveryFee: number,
  ) {
    const coupon = this.couponRepository.findById(couponId);
    if (!coupon) {
      throw new AppError("COUPON_NOT_FOUND");
    }

    return coupon.getDiscountAmount({
      targetPrice: orderPrice,
      checkoutItems,
      deliveryFee,
    });
  }

  getRecommendedCouponIds(
    orderPrice: number,
    checkoutItems: CheckoutItem[],
    deliveryFee: number,
    requestedAt: Date,
  ) {
    const availableCoupons = this.couponRepository
      .getCouponList()
      .filter((coupon) =>
        coupon.isAvailable({
          checkoutItems,
          requestedAt,
        }),
      );

    let targetPrice = orderPrice;
    let firstMaxDiscountCouponId: number | null = null;
    let firstMaxDiscountPrice = 0;
    availableCoupons.forEach((coupon) => {
      if (coupon.getDiscountType() === "fixed") {
        const discountAmount = coupon.getDiscountAmount({
          targetPrice,
          deliveryFee,
          checkoutItems,
        });
        if (discountAmount > firstMaxDiscountPrice) {
          firstMaxDiscountCouponId = coupon.toJson().id;
          firstMaxDiscountPrice = discountAmount;
        }
      }
    });

    // 적용할 쿠폰이 없어서 return
    if (firstMaxDiscountCouponId === null) return [];
    const firstCouponId = firstMaxDiscountCouponId;

    targetPrice -= firstMaxDiscountPrice;
    const firstCouponRemovedCoupons = availableCoupons.filter(
      (coupon) => !coupon.isSameId(firstCouponId),
    );

    let secondMaxDiscountCouponId: number | null = null;
    let secondMaxDiscountPrice = 0;

    firstCouponRemovedCoupons.forEach((coupon) => {
      const discountAmount = coupon.getDiscountAmount({
        targetPrice,
        deliveryFee,
        checkoutItems,
      });
      if (discountAmount > secondMaxDiscountPrice) {
        secondMaxDiscountCouponId = coupon.toJson().id;
        secondMaxDiscountPrice = discountAmount;
      }
    });

    // 적용할 2번째 쿠폰 없는 경우 바로 return
    if (secondMaxDiscountCouponId === null) return [firstCouponId];

    return [firstCouponId, secondMaxDiscountCouponId];
  }

  createBaseCoupon() {
    // 초기 쿠폰 생성 (하드코딩)
    mockCouponData.forEach((couponData) =>
      this.createCoupon({ ...couponData }),
    );
  }
}

export default CouponService;
