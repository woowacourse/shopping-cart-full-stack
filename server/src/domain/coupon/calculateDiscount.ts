import type { CalculationItem } from "../../types/type.ts";
import Coupon, { type CouponContext } from "./Coupon.ts";

export const FREE_SHIPPING_THRESHOLD = 100_000;
export const DEFAULT_SHIPPING_FEE = 3_000;
export const REMOTE_AREA_SURCHARGE = 3_000;
export const MAX_COUPON_COUNT = 2;

export interface OrderCalculation {
  orderAmount: number;
  discountAmount: number;
  shippingFee: number;
  totalPayment: number;
}

/** 쿠폰 적용 순서: 정액(상품) → 정율(상품). 배송 쿠폰은 별도로 처리한다. */
const APPLY_ORDER = {
  PRODUCT_FIXED: 0,
  PRODUCT_PERCENT: 1,
  SHIPPING: 2,
} as const;

export function getOrderAmount(items: CalculationItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

/**
 * 쿠폰 적용 전 배송비.
 * 주문 금액(쿠폰 적용 전)이 임계값 이상이면 기본 배송비 무료
 * 도서산간 지역이면 추가 배송비를 더한다
 */
export function getShippingFee(
  orderAmount: number,
  isRemoteArea: boolean,
): number {
  const baseFee =
    orderAmount >= FREE_SHIPPING_THRESHOLD ? 0 : DEFAULT_SHIPPING_FEE;
  const remoteSurcharge = isRemoteArea ? REMOTE_AREA_SURCHARGE : 0;
  return baseFee + remoteSurcharge;
}

/**
 * 선택된 쿠폰들을 적용해 최종 금액을 계산한다.
 * 사용 불가능한(만료/최소금액 미달/시간대 밖) 쿠폰은 자동으로 무시된다.
 */
export function calculateOrder(
  items: CalculationItem[],
  coupons: Coupon[],
  isRemoteArea: boolean,
  now: Date = new Date(),
): OrderCalculation {
  const orderAmount = getOrderAmount(items);
  const shippingBeforeCoupon = getShippingFee(orderAmount, isRemoteArea);

  const baseContext: CouponContext = {
    items,
    orderAmount,
    currentAmount: orderAmount,
    shippingFee: shippingBeforeCoupon,
    now,
  };

  const applicable = coupons.filter((coupon) =>
    coupon.isAvailable(baseContext),
  );
  const sorted = [...applicable].sort(
    (a, b) => APPLY_ORDER[a.category] - APPLY_ORDER[b.category],
  );

  let currentAmount = orderAmount;
  let shippingFee = shippingBeforeCoupon;

  for (const coupon of sorted) {
    if (coupon.category === "SHIPPING") {
      shippingFee -= coupon.discount({ ...baseContext, shippingFee });
      continue;
    }
    currentAmount -= coupon.discount({ ...baseContext, currentAmount });
  }

  shippingFee = Math.max(0, shippingFee);
  const discountAmount = orderAmount - currentAmount;

  return {
    orderAmount,
    discountAmount,
    shippingFee,
    totalPayment: currentAmount + shippingFee,
  };
}

/**
 * 사용 가능한 쿠폰들 중 할인 효과가 가장 큰 조합(최대 MAX_COUPON_COUNT개)을 찾는다.
 * 상품 할인뿐 아니라 배송비 절약까지 합산해 비교한다.
 */
export function getMaxDiscountCoupons(
  items: CalculationItem[],
  coupons: Coupon[],
  isRemoteArea: boolean,
  now: Date = new Date(),
): Coupon[] {
  const orderAmount = getOrderAmount(items);
  const shippingBeforeCoupon = getShippingFee(orderAmount, isRemoteArea);
  const fullPrice = orderAmount + shippingBeforeCoupon;

  const combinations = pickCombinations(coupons, MAX_COUPON_COUNT);

  let best: Coupon[] = [];
  let maxSavings = 0;

  for (const combination of combinations) {
    const { totalPayment } = calculateOrder(
      items,
      combination,
      isRemoteArea,
      now,
    );
    const savings = fullPrice - totalPayment;

    if (savings > maxSavings) {
      maxSavings = savings;
      best = combination;
    }
  }

  return best;
}

/** 길이 1 ~ maxSize 의 모든 조합을 만든다. */
function pickCombinations<T>(items: T[], maxSize: number): T[][] {
  const result: T[][] = [];

  const backtrack = (start: number, picked: T[]) => {
    if (picked.length > 0) result.push([...picked]);
    if (picked.length === maxSize) return;

    for (let i = start; i < items.length; i++) {
      picked.push(items[i]);
      backtrack(i + 1, picked);
      picked.pop();
    }
  };

  backtrack(0, []);
  return result;
}
