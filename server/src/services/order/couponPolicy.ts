import type { Coupon, CouponType } from "../../models/Coupon.js";

export interface OrderLineItem {
  productId: string;
  price: number;
  quantity: number;
}

export interface CouponContext {
  orderAmount: number; // 쿠폰 적용 전 주문금액
  items: OrderLineItem[];
  now: Date;
}

export type CouponCategory = "AMOUNT" | "PERCENT" | "SHIPPING";

// 쿠폰 정책 상수 (할인 파라미터는 DB가 아니라 type 별 코드 상수로 관리)
export const FIXED5000_MIN_ORDER = 100_000;
export const FIXED5000_DISCOUNT = 5_000;
export const FREESHIPPING_MIN_ORDER = 50_000;
export const MIRACLESALE_RATE = 0.3;
export const MIRACLESALE_START_HOUR = 4;
export const MIRACLESALE_END_HOUR = 7;
export const BOGO_MIN_QUANTITY = 2;

export const categoryOf = (type: CouponType): CouponCategory => {
  switch (type) {
    case "FIXED5000":
    case "BOGO":
      return "AMOUNT";
    case "MIRACLESALE":
      return "PERCENT";
    case "FREESHIPPING":
      return "SHIPPING";
  }
};

// BOGO: 동일 상품 2개 이상 구매 시, 단가가 가장 높은 상품 1개를 무료 처리
const bogoFreeUnitPrice = (items: OrderLineItem[]): number => {
  const eligible = items.filter((item) => item.quantity >= BOGO_MIN_QUANTITY);

  if (eligible.length === 0) {
    return 0;
  }

  return Math.max(...eligible.map((item) => item.price));
};

export const isApplicable = (coupon: Coupon, ctx: CouponContext): boolean => {
  return inapplicableReasonOf(coupon, ctx) === null;
};

export const inapplicableReasonOf = (
  coupon: Coupon,
  ctx: CouponContext,
): string | null => {
  if (coupon.isExpired(ctx.now)) return "만료된 쿠폰입니다";
  switch (coupon.type) {
    case "FIXED5000":
      return ctx.orderAmount >= FIXED5000_MIN_ORDER
        ? null
        : `최소 주문 금액 ${FIXED5000_MIN_ORDER.toLocaleString()}원 이상`;
    case "FREESHIPPING":
      return ctx.orderAmount >= FREESHIPPING_MIN_ORDER
        ? null
        : `최소 주문 금액 ${FREESHIPPING_MIN_ORDER.toLocaleString()}원 이상`;
    case "MIRACLESALE": {
      const hour = ctx.now.getHours();
      return hour >= MIRACLESALE_START_HOUR && hour < MIRACLESALE_END_HOUR
        ? null
        : `오전 ${MIRACLESALE_START_HOUR}~${MIRACLESALE_END_HOUR}시에만 사용 가능`;
    }
    case "BOGO":
      return bogoFreeUnitPrice(ctx.items) > 0
        ? null
        : `동일 상품 ${BOGO_MIN_QUANTITY}개 이상 구매 시`;
  }
};

// 정액 쿠폰이 차감하는 '원' 단위 금액
export const amountDiscountOf = (
  coupon: Coupon,
  ctx: CouponContext,
): number => {
  switch (coupon.type) {
    case "FIXED5000":
      return FIXED5000_DISCOUNT;
    case "BOGO":
      return bogoFreeUnitPrice(ctx.items);
    default:
      return 0;
  }
};

// 정율 쿠폰의 할인율 (0~1)
export const percentRateOf = (coupon: Coupon): number =>
  coupon.type === "MIRACLESALE" ? MIRACLESALE_RATE : 0;

export const isFreeShipping = (coupon: Coupon): boolean =>
  coupon.type === "FREESHIPPING";

// 쿠폰 조건 안내문구 (정책 상수에서 파생 — 표시 텍스트의 단일 출처)
export const conditionTextOf = (type: CouponType): string => {
  switch (type) {
    case "FIXED5000":
      return `최소 주문금액 ${FIXED5000_MIN_ORDER.toLocaleString("ko-KR")}원`;
    case "FREESHIPPING":
      return `최소 주문금액 ${FREESHIPPING_MIN_ORDER.toLocaleString("ko-KR")}원`;
    case "MIRACLESALE":
      return `사용 가능 시간 오전 ${MIRACLESALE_START_HOUR}시~${MIRACLESALE_END_HOUR}시`;
    case "BOGO":
      // 이름("2개 구매 시 1개 무료 쿠폰")이 조건을 이미 담아 별도 안내줄 생략
      return "";
  }
};
