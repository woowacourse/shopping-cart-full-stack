import { AppError } from "../../errors/AppError.js";
import { findAllByIds } from "../../repositories/coupon.repository.js";
import { Coupon, COUPON_CATEGORY } from "../../interfaces/coupon.interface.js";
import { PricedItem } from "../../interfaces/checkout.interface.js";

export const MAX_COUPON_COUNT = 2;
export const BTGO_MIN_QUANTITY = 3;

export interface CouponContext {
  checkoutAmount: number;
  items: PricedItem[];
  now: Date;
}

export function validateCouponCondition(coupon: Coupon, context: CouponContext): boolean {
  return (
    !isExpired(coupon, context.now) &&
    isAboveMinOrderAmount(coupon, context.checkoutAmount) &&
    isInsideUsableTime(coupon, context.now) &&
    isBtgoQuantityMet(coupon, context.items)
  );
}

export async function getValidCoupons(couponIds: number[], context: CouponContext): Promise<Coupon[]> {
  if (couponIds.length > MAX_COUPON_COUNT) {
    throw new AppError("INVALID_COUPON_CONDITION", 400);
  }

  const coupons = await findCouponsOrThrow(couponIds);
  if (!coupons.every((coupon) => validateCouponCondition(coupon, context))) {
    throw new AppError("INVALID_COUPON_CONDITION", 400);
  }

  return coupons;
}

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function isExpired(coupon: Coupon, now: Date): boolean {
  return new Date(coupon.expiredDate).getTime() < now.getTime();
}

/** 최소 주문 금액 조건이 없거나, checkoutAmount가 그 이상이면 true. */
function isAboveMinOrderAmount(coupon: Coupon, checkoutAmount: number): boolean {
  return coupon.minOrderAmount === undefined || checkoutAmount >= coupon.minOrderAmount;
}

/** 사용 시간 제한이 없거나, 현재 시각이 usable 범위 안이면 true. */
function isInsideUsableTime(coupon: Coupon, now: Date): boolean {
  if (coupon.usableStartAt === undefined || coupon.usableEndAt === undefined) {
    return true;
  }
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return nowMinutes >= toMinutes(coupon.usableStartAt) && nowMinutes <= toMinutes(coupon.usableEndAt);
}

function isBtgoQuantityMet(coupon: Coupon, items: PricedItem[]): boolean {
  if (coupon.category !== COUPON_CATEGORY.BTGO) {
    return true;
  }
  return items.some((item) => item.quantity >= BTGO_MIN_QUANTITY);
}

async function findCouponsOrThrow(couponIds: number[]): Promise<Coupon[]> {
  const coupons = await findAllByIds(couponIds);
  if (coupons.length !== new Set(couponIds).size) {
    throw new AppError("COUPON_NOT_FOUND", 404);
  }
  return coupons;
}
