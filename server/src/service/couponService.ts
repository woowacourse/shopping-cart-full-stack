import { couponRepository } from "../database/couponDatabase.ts";
import Coupon, { type CouponContext } from "../domain/coupon/Coupon.ts";
import {
  calculateOrder,
  getMaxDiscountCoupons,
  getOrderAmount,
  getShippingFee,
  MAX_COUPON_COUNT,
  type OrderCalculation,
} from "../domain/coupon/calculateDiscount.ts";
import type { CalculationItem } from "../types/type.ts";
import { BadRequestError, NotFoundError } from "../error.ts";

export interface CouponSummary {
  id: number;
  name: string;
  type: Coupon["type"];
  expiryDate: string;
  minAmount: number | null;
  startTime: string | null;
  endTime: string | null;
}

export interface CalculationResult extends OrderCalculation {
  totalDiscount: number;
  availableCouponIds: number[];
  recommendedCouponIds: number[];
}

interface CalculationParams {
  items: CalculationItem[];
  couponIds: number[];
  isRemoteArea: boolean;
  now?: Date;
}

export function getAllCoupons(): CouponSummary[] {
  return couponRepository.getAll().map(toSummary);
}

// 선택된 쿠폰을 적용한 최종 금액과, 사용 가능/추천 쿠폰 목록을 함께 계산한다.
export function calculateCoupons({
  items,
  couponIds,
  isRemoteArea,
  now = new Date(),
}: CalculationParams): CalculationResult {
  validateKnownIds(couponIds);
  validateCouponCount(couponIds);

  const selected = couponRepository.getByIds(couponIds);
  const calculation = calculateOrder(items, selected, isRemoteArea, now);

  const shippingBeforeCoupon = getShippingFee(
    calculation.orderAmount,
    isRemoteArea,
  );
  const totalDiscount =
    calculation.discountAmount +
    (shippingBeforeCoupon - calculation.shippingFee);

  const baseContext = buildContext(items, isRemoteArea, now);
  const availableCoupons = couponRepository
    .getAll()
    .filter((coupon) => coupon.isAvailable(baseContext));

  const recommended = getMaxDiscountCoupons(
    items,
    availableCoupons,
    isRemoteArea,
    now,
  );

  return {
    ...calculation,
    totalDiscount,
    availableCouponIds: availableCoupons.map((coupon) => coupon.id),
    recommendedCouponIds: recommended.map((coupon) => coupon.id),
  };
}

/** 결제 시점에 쿠폰의 존재/만료/개수를 검증한다. */
export function validateCoupons(couponIds: number[], now: Date = new Date()) {
  validateCouponCount(couponIds);

  for (const id of couponIds) {
    const coupon = couponRepository.getById(id);

    if (!coupon) {
      throw new NotFoundError({
        code: "NOT_FOUND_COUPON",
        message: "해당 쿠폰이 존재하지 않습니다.",
        field: "couponId",
      });
    }

    if (coupon.isExpired(now)) {
      throw new BadRequestError({
        code: "EXPIRED_COUPON",
        message: "만료된 쿠폰이 존재합니다.",
        field: "couponId",
      });
    }
  }
}

function validateKnownIds(couponIds: number[]) {
  const unknown = couponIds.find((id) => !couponRepository.hasId(id));
  if (unknown !== undefined) {
    throw new BadRequestError({
      code: "INVALID_COUPON_TYPE",
      message: "존재하지 않는 쿠폰입니다.",
      field: "couponId",
    });
  }
}

function validateCouponCount(couponIds: number[]) {
  if (couponIds.length > MAX_COUPON_COUNT) {
    throw new BadRequestError({
      code: "TOO_MANY_COUPONS",
      message: "사용 가능한 쿠폰 수량을 초과했습니다.",
      field: "couponId",
    });
  }
}

function buildContext(
  items: CalculationItem[],
  isRemoteArea: boolean,
  now: Date,
): CouponContext {
  const orderAmount = getOrderAmount(items);
  return {
    items,
    orderAmount,
    currentAmount: orderAmount,
    shippingFee: getShippingFee(orderAmount, isRemoteArea),
    now,
  };
}

function toSummary(coupon: Coupon): CouponSummary {
  return {
    id: coupon.id,
    name: coupon.name,
    type: coupon.type,
    expiryDate: coupon.expiryDate,
    minAmount: coupon.minAmount,
    startTime: coupon.startTime,
    endTime: coupon.endTime,
  };
}
