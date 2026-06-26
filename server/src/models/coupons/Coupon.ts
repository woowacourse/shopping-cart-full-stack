import OrderSheet from '../OrderSheet.js';

export type CouponCode = 'FIXED5000' | 'BOGO' | 'FREESHIPPING' | 'MIRACLESALE';
export type DiscountType = 'FIXED' | 'RATE';

export interface AvailableTimeRange {
  startsAt: string;
  endsAt: string;
}

export interface CouponConditions {
  minimumOrderAmount?: number;
  availableTimeRange?: AvailableTimeRange;
}

export interface CouponParams {
  code: CouponCode;
  name: string;
  expiresAt: Date;
  conditions?: CouponConditions;
}

export interface CouponType extends CouponParams {
  id: string;
}

export interface CouponContext {
  orderSheet: OrderSheet;
  orderAmount: number;
  shippingFee: number;
  now: Date;
}

export interface Coupon {
  getId(): string;
  getCode(): CouponCode;
  getDiscountType(): DiscountType;
  canApply(context: CouponContext): boolean;
  calculateDiscount(context: CouponContext): number;
  toObject(): CouponType;
}

abstract class BaseCoupon implements Coupon {
  #id: string;
  #code: CouponCode;
  #name: string;
  #expiresAt: Date;
  #conditions?: CouponConditions;

  constructor({ code, name, expiresAt, conditions }: CouponParams) {
    this.#id = crypto.randomUUID();
    this.#code = code;
    this.#name = name;
    this.#expiresAt = expiresAt;
    this.#conditions = conditions;
  }

  getId() {
    return this.#id;
  }

  getCode() {
    return this.#code;
  }

  canApply(context: CouponContext) {
    const { orderAmount, now } = context;
    const minimumOrderAmount = this.#conditions?.minimumOrderAmount ?? 0;
    const availableTimeRange = this.#conditions?.availableTimeRange;

    if (now > this.#expiresAt) {
      return false;
    }

    if (orderAmount < minimumOrderAmount) {
      return false;
    }

    if (availableTimeRange && !isTimeAvailable(now, availableTimeRange)) {
      return false;
    }

    return true;
  }

  toObject(): CouponType {
    return {
      id: this.#id,
      code: this.#code,
      name: this.#name,
      expiresAt: this.#expiresAt,
      conditions: this.#conditions,
    };
  }

  abstract getDiscountType(): DiscountType;
  abstract calculateDiscount(context: CouponContext): number;
}

function isTimeAvailable(now: Date, availableTimeRange: AvailableTimeRange) {
  const currentTime = now.toLocaleTimeString('ko-KR', {
    timeZone: 'Asia/Seoul',
    hour: '2-digit',
    minute: '2-digit',
  });
  const { startsAt, endsAt } = availableTimeRange;

  return startsAt <= currentTime && currentTime < endsAt;
}

export default BaseCoupon;
