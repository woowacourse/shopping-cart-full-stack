import { DELIVERY_FEE } from "../checkout/checkout.constant.js";
import { CheckoutItem } from "../checkout/Checkout.js";
import { getFormatDate, stringToHoursAndMinutes } from "./coupon.util.js";

export type CouponItem = {
  id: number;
  baseInformation: CouponBaseInformation;
  discountPolicy: CouponDiscountPolicy;
  condition: CouponCondition;
};

export type CouponBaseInformation = {
  name: string;
  type: string;
  expiryDate: Date;
};
export type CouponDiscountPolicy = {
  fixedDiscountPrice: number | null;
  fixedDiscountRate: number | null;
};
export type CouponCondition = {
  minAmount: number | null;
  startTime: string | null;
  endTime: string | null;
};

export type CouponAvailabilityContext = {
  checkoutItems: CheckoutItem[];
  requestedAt: Date;
};

export type CouponDiscountContext = {
  targetPrice: number;
  checkoutItems: CheckoutItem[];
  deliveryFee: number;
};

export abstract class Coupon {
  constructor(
    protected readonly id: number,
    protected readonly baseInformation: CouponBaseInformation,
    protected readonly discountPolicy: CouponDiscountPolicy,
    protected readonly condition: CouponCondition,
  ) {}

  abstract isAvailable(context: CouponAvailabilityContext): boolean;
  abstract getDiscountAmount(context: CouponDiscountContext): number;

  isSameId(couponId: number) {
    return this.id === couponId;
  }

  getDiscountType() {
    if (this.discountPolicy.fixedDiscountRate) {
      return "ratio";
    }

    return "fixed";
  }

  toJson() {
    return {
      id: this.id,
      ...this.baseInformation,
      expiryDate: getFormatDate(this.baseInformation.expiryDate),
      ...this.discountPolicy,
      ...this.condition,
    };
  }
}

export class FixedCoupon extends Coupon {
  constructor(
    id: number,
    baseInformation: CouponBaseInformation,
    discountPolicy: CouponDiscountPolicy,
    condition: CouponCondition,
  ) {
    super(id, baseInformation, discountPolicy, condition);
  }

  isAvailable({ checkoutItems, requestedAt }: CouponAvailabilityContext) {
    const orderPrice = checkoutItems.reduce(
      (sum, item) => sum + item.price * item.itemCount,
      0,
    );
    if (this.condition.minAmount === null) {
      throw new Error("최소 주문 금액이 설정되지 않았습니다.");
    }
    if (requestedAt > this.baseInformation.expiryDate) {
      return false;
    }
    if (orderPrice < this.condition.minAmount) {
      return false;
    }

    return true;
  }

  getDiscountAmount() {
    if (this.discountPolicy.fixedDiscountPrice === null) {
      throw new Error("할인 금액이 제대로 설정되지 않았습니다.");
    }

    return this.discountPolicy.fixedDiscountPrice;
  }
}

export class BogoCoupon extends Coupon {
  constructor(
    id: number,
    baseInformation: CouponBaseInformation,
    discountPolicy: CouponDiscountPolicy,
    condition: CouponCondition,
  ) {
    super(id, baseInformation, discountPolicy, condition);
  }

  isAvailable({ checkoutItems, requestedAt }: CouponAvailabilityContext) {
    if (!checkoutItems.some((item) => item.itemCount >= 3)) {
      return false;
    }
    if (requestedAt > this.baseInformation.expiryDate) {
      return false;
    }

    return true;
  }

  getDiscountAmount({ checkoutItems }: CouponDiscountContext) {
    const filteredPrice = checkoutItems
      .filter((item) => item.itemCount >= 3)
      .map((item) => item.price);

    if (filteredPrice.length === 0) {
      return 0;
    }

    return Math.max(...filteredPrice);
  }
}

export class FreeShippingCoupon extends Coupon {
  constructor(
    id: number,
    baseInformation: CouponBaseInformation,
    discountPolicy: CouponDiscountPolicy,
    condition: CouponCondition,
  ) {
    super(id, baseInformation, discountPolicy, condition);
  }

  isAvailable({ checkoutItems, requestedAt }: CouponAvailabilityContext) {
    const orderPrice = checkoutItems.reduce(
      (sum, item) => sum + item.price * item.itemCount,
      0,
    );
    if (this.condition.minAmount === null) {
      throw new Error("최소 주문 금액이 설정되지 않았습니다.");
    }
    if (requestedAt > this.baseInformation.expiryDate) {
      return false;
    }
    if (orderPrice < this.condition.minAmount) {
      return false;
    }
    if (orderPrice >= DELIVERY_FEE.FREE_BOUNDARY) {
      return false;
    }

    return true;
  }

  getDiscountAmount({ deliveryFee }: CouponDiscountContext) {
    return deliveryFee;
  }
}

export class MiracleSaleCoupon extends Coupon {
  constructor(
    id: number,
    baseInformation: CouponBaseInformation,
    discountPolicy: CouponDiscountPolicy,
    condition: CouponCondition,
  ) {
    super(id, baseInformation, discountPolicy, condition);
  }

  isAvailable({ requestedAt }: CouponAvailabilityContext) {
    if (this.condition.startTime === null || this.condition.endTime === null) {
      throw new Error("쿠폰 적용 시간이 설정되지 않았습니다.");
    }
    if (requestedAt > this.baseInformation.expiryDate) {
      return false;
    }
    const requestHour = requestedAt.getHours();
    const requestMinutes = requestedAt.getMinutes();
    const [startHour, startMinutes] = stringToHoursAndMinutes(
      this.condition.startTime,
    );
    const [endHour, endMinutes] = stringToHoursAndMinutes(
      this.condition.endTime,
    );

    if (requestHour < startHour) return false;
    if (requestHour === startHour && requestMinutes < startMinutes)
      return false;

    if (requestHour > endHour) return false;
    if (requestHour === endHour && requestMinutes >= endMinutes) return false;

    return true;
  }

  getDiscountAmount({ targetPrice }: CouponDiscountContext) {
    if (this.discountPolicy.fixedDiscountRate === null) {
      throw new Error("할인 비율이 제대로 설정되지 않았습니다.");
    }

    return targetPrice * (this.discountPolicy.fixedDiscountRate / 100);
  }
}
