import type { CalculationItem, CouponType } from "../../types/type.ts";

/**
 * 쿠폰이 무엇을, 어떤 순서로 깎는지를 나타낸다.
 * PRODUCT_FIXED : 상품 금액에서 정액 할인 (FIXED5000, BOGO)
 * PRODUCT_PERCENT : 정액 할인 이후의 금액에서 정율 할인 (MIRACLESALE)
 * SHIPPING : 배송비를 깎는다 (FREESHIPPING)
 */
export type DiscountCategory = "PRODUCT_FIXED" | "PRODUCT_PERCENT" | "SHIPPING";

export interface CouponContext {
  items: CalculationItem[];
  orderAmount: number;
  currentAmount: number;
  shippingFee: number;
  now: Date;
}

export interface CouponProps {
  id: number;
  name: string;
  type: CouponType;
  expiryDate: string;
  minAmount?: number | null;
  startTime?: string | null;
  endTime?: string | null;
}

/**
 * 쿠폰 도메인의 추상 기반 클래스.
 * 이 쿠폰이 얼마를 깎는가(discount)와 지금 쓸 수 있는가(isAvailable)만 외부에 노출하고,
 * 만료/최소금액/시간대 같은 판단 로직은 내부에 숨긴다.
 */
export default abstract class Coupon {
  readonly id: number;
  readonly name: string;
  readonly type: CouponType;
  readonly expiryDate: string;
  readonly minAmount: number | null;
  readonly startTime: string | null;
  readonly endTime: string | null;

  abstract readonly category: DiscountCategory;

  constructor({
    id,
    name,
    type,
    expiryDate,
    minAmount = null,
    startTime = null,
    endTime = null,
  }: CouponProps) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.expiryDate = expiryDate;
    this.minAmount = minAmount;
    this.startTime = startTime;
    this.endTime = endTime;
  }

  /** 이 쿠폰이 깎아주는 금액(원). 적용 대상에 따라 상품 금액 또는 배송비를 깎는다. */
  abstract discount(context: CouponContext): number;

  /** 만료되지 않았고, 최소 주문 금액과 시간대 조건을 모두 만족하면 사용 가능하다. */
  isAvailable(context: CouponContext): boolean {
    return (
      !this.isExpired(context.now) &&
      this.meetsMinAmount(context.orderAmount) &&
      this.isWithinTimeWindow(context.now)
    );
  }

  isExpired(now: Date): boolean {
    const endOfExpiryDate = new Date(`${this.expiryDate}T23:59:59`);
    return now.getTime() > endOfExpiryDate.getTime();
  }

  private meetsMinAmount(orderAmount: number): boolean {
    if (this.minAmount === null) return true;
    return orderAmount >= this.minAmount;
  }

  private isWithinTimeWindow(now: Date): boolean {
    if (this.startTime === null || this.endTime === null) return true;

    const current = now.getHours() * 60 + now.getMinutes();
    return (
      current >= toMinutes(this.startTime) && current < toMinutes(this.endTime)
    );
  }
}

function toMinutes(time: string): number {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}
