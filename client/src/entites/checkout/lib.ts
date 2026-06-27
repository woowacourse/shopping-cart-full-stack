import { formatHour } from "../../shared/date";
import type { CartItem, CheckoutItem, Coupon, Gift, Rule } from "./model";

export const toCheckoutItems = (items: CartItem[], gifts: Gift[]): CheckoutItem[] =>
  items.map((item) => ({
    ...item,
    giftQuantity: gifts.find((gift) => gift.productId === item.id)?.quantity ?? 0,
  }));

// 쿠폰 사용 조건을 한국어 안내 문구로 변환 (조건 없는 쿠폰은 null)
export const getCouponRuleText = (rule: Rule | null | undefined): string | null => {
  if (!rule) return null;
  if (rule.type === "LOW_PRICE") return `최소 주문 금액: ${rule.price.toLocaleString()}원`;
  return `사용 가능 시간: ${formatHour(rule.startAt)}부터 ${formatHour(rule.endAt)}까지`;
};

const couponDiscount = (payable: number, coupon: Coupon): number =>
  coupon.discount.type === "FIXED"
    ? coupon.discount.amount
    : Math.floor((payable * coupon.discount.rate) / 100);

export const calculateDiscount = (coupons: Coupon[], orderPrice: number): number => {
  const fixed = coupons.filter((coupon) => coupon.discount.type === "FIXED");
  const rate = coupons.filter((coupon) => coupon.discount.type === "RATE");
  const payable = [...fixed, ...rate].reduce(
    (price, coupon) => price - couponDiscount(price, coupon),
    orderPrice,
  );
  return orderPrice - payable;
};
