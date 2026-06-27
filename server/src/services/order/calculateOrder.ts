import type { Coupon } from '../../models/Coupon.js';
import {
  amountDiscountOf,
  categoryOf,
  isApplicable,
  isFreeShipping,
  percentRateOf,
  type CouponContext,
  type OrderLineItem,
} from './couponPolicy.js';

export const FREE_SHIPPING_THRESHOLD = 100_000;
export const BASE_SHIPPING_FEE = 3_000;
export const REMOTE_AREA_SURCHARGE = 3_000;
export const MAX_COUPONS = 2;

export interface OrderCalculationInput {
  items: OrderLineItem[];
  candidateCoupons: Coupon[];
  isRemoteArea: boolean;
  now: Date;
}

export interface OrderCalculationResult {
  orderAmount: number;
  couponDiscount: number;
  deliveryFee: number;
  totalPrice: number;
  appliedCoupons: string[];
}

export const sumOrderAmount = (items: OrderLineItem[]): number =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

// 배송비: 주문금액(쿠폰 적용 전) 10만 이상이면 도서산간이어도 전액 무료.
// 10만 미만일 때만 기본 3,000원 + 도서산간 3,000원 추가.
const baseDeliveryFee = (orderAmount: number, isRemoteArea: boolean): number => {
  if (orderAmount >= FREE_SHIPPING_THRESHOLD) {
    return 0;
  }

  return BASE_SHIPPING_FEE + (isRemoteArea ? REMOTE_AREA_SURCHARGE : 0);
};

interface ComboResult {
  couponDiscount: number;
  deliveryFee: number;
  totalSavings: number; // 쿠폰 할인 + 배송비 절감 (최적 조합 선택 기준)
}

const evaluateCombo = (
  combo: Coupon[],
  ctx: CouponContext,
  baseDelivery: number
): ComboResult => {
  // 1) 정액 쿠폰을 먼저 차감
  const totalFixed = combo
    .filter((coupon) => categoryOf(coupon.type) === 'AMOUNT')
    .reduce((sum, coupon) => sum + amountDiscountOf(coupon, ctx), 0);
  const afterFixed = Math.max(0, ctx.orderAmount - totalFixed);

  // 2) 정율 쿠폰을 '할인된 금액'에 적용
  const totalRate = combo
    .filter((coupon) => categoryOf(coupon.type) === 'PERCENT')
    .reduce((sum, coupon) => sum + percentRateOf(coupon), 0);
  const percentDiscount = Math.round(afterFixed * totalRate);

  const finalAmount = afterFixed - percentDiscount;
  const couponDiscount = ctx.orderAmount - finalAmount;

  // 3) 배송비: FREESHIPPING 포함 시 도서산간 추가분까지 전액 무료
  const deliveryFee = combo.some(isFreeShipping) ? 0 : baseDelivery;
  const shippingSaved = baseDelivery - deliveryFee;

  return {
    couponDiscount,
    deliveryFee,
    totalSavings: couponDiscount + shippingSaved,
  };
};

// 크기 0~maxSize 의 모든 조합 (빈 조합 = 쿠폰 미적용 포함)
const buildCombinations = (coupons: Coupon[], maxSize: number): Coupon[][] => {
  const combinations: Coupon[][] = [[]];

  for (let i = 0; i < coupons.length; i++) {
    combinations.push([coupons[i]]);

    if (maxSize >= 2) {
      for (let j = i + 1; j < coupons.length; j++) {
        combinations.push([coupons[i], coupons[j]]);
      }
    }
  }

  return combinations;
};

export const calculateOrder = (input: OrderCalculationInput): OrderCalculationResult => {
  const { items, candidateCoupons, isRemoteArea, now } = input;

  const orderAmount = sumOrderAmount(items);
  const couponCtx: CouponContext = { orderAmount, items, now };
  const baseDelivery = baseDeliveryFee(orderAmount, isRemoteArea);

  // 만료/조건 미충족 쿠폰은 후보에서 제외
  const applicable = candidateCoupons.filter((coupon) => isApplicable(coupon, couponCtx));

  // 최대 2개 조합 중 절감액이 가장 큰 조합 자동 선택
  let best = {
    combo: [] as Coupon[],
    couponDiscount: 0,
    deliveryFee: baseDelivery,
    totalSavings: 0,
  };

  for (const combo of buildCombinations(applicable, MAX_COUPONS)) {
    const result = evaluateCombo(combo, couponCtx, baseDelivery);

    if (result.totalSavings > best.totalSavings) {
      best = {
        combo,
        couponDiscount: result.couponDiscount,
        deliveryFee: result.deliveryFee,
        totalSavings: result.totalSavings,
      };
    }
  }

  return {
    orderAmount,
    couponDiscount: best.couponDiscount,
    deliveryFee: best.deliveryFee,
    totalPrice: orderAmount - best.couponDiscount + best.deliveryFee,
    appliedCoupons: best.combo
      .map((coupon) => coupon.id)
      .sort((a, b) => Number(a) - Number(b)),
  };
};
