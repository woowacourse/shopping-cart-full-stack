import {
  DiscountCondition,
  ExpireDateDiscountCondition,
  MinimumItemQuantityDiscountCondition,
} from "./DiscountCondition.js";
import { OrderContext } from "../types.js";

export enum CouponPhase {
  FIXED = 1,
  RATE = 2,
}

export abstract class Coupon {
  private readonly id: string;
  private readonly conditions: DiscountCondition[];
  private readonly name: string;
  private readonly expirationDate: Date | null;
  abstract readonly phase: CouponPhase;

  constructor(
    conditions: DiscountCondition[],
    name: string,
    expirationDate?: Date,
  ) {
    this.id = crypto.randomUUID();
    this.expirationDate = expirationDate ?? null;
    this.conditions = this.expirationDate
      ? [new ExpireDateDiscountCondition(this.expirationDate), ...conditions]
      : conditions;
    this.name = name;
  }

  public getId() {
    return this.id;
  }

  public isAvailable(orderContext: OrderContext) {
    return this.conditions.every((policy) => policy.isAvailable(orderContext));
  }

  public isDeliveryDiscount(): boolean {
    return false;
  }

  public abstract getDiscountPrice(
    orderContext: OrderContext,
    basePrice?: number,
  ): number;

  public toObject() {
    return {
      id: this.id,
      name: this.name,
      expiration_date:
        this.expirationDate?.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }) ?? null,
      description: this.conditions
        .map((conditions) => conditions.description())
        .filter(Boolean)
        .join(", "),
    };
  }
}

export class AmountDiscountCoupon extends Coupon {
  public readonly phase = CouponPhase.FIXED;
  private readonly discountPrice: number;

  constructor({
    conditions,
    discountPrice,
    expirationDate,
  }: {
    conditions: DiscountCondition[];
    discountPrice: number;
    expirationDate?: Date;
  }) {
    super(
      conditions,
      `${discountPrice.toLocaleString("ko-KR")}원 할인 쿠폰`,
      expirationDate,
    );
    this.discountPrice = discountPrice;
  }

  public getDiscountPrice() {
    return this.discountPrice;
  }
}

export class BonusCoupon extends Coupon {
  public readonly phase = CouponPhase.FIXED;
  private readonly bonusCount: number;
  private readonly minQuantity: number;

  constructor({
    conditions,
    minQuantity,
    bonusCount,
    expirationDate,
  }: {
    conditions: DiscountCondition[];
    minQuantity: number;
    bonusCount: number;
    expirationDate?: Date;
  }) {
    super(
      [...conditions, new MinimumItemQuantityDiscountCondition(minQuantity)],
      `${minQuantity}+${bonusCount} 쿠폰`,
      expirationDate,
    );
    this.minQuantity = minQuantity;
    this.bonusCount = bonusCount;
  }

  public getDiscountPrice(orderContext: OrderContext): number {
    const price = orderContext.findMostExpensiveItemPrice(this.minQuantity);
    if (!price) return 0;
    return price * this.bonusCount;
  }
}

export class FreeDeliveryCoupon extends Coupon {
  public readonly phase = CouponPhase.FIXED;

  constructor({
    conditions,
    expirationDate,
  }: {
    conditions: DiscountCondition[];
    expirationDate?: Date;
  }) {
    super(conditions, "무료 배송 쿠폰", expirationDate);
  }

  public isDeliveryDiscount(): boolean {
    return true;
  }

  public getDiscountPrice(orderContext: OrderContext) {
    return orderContext.calculateDeliveryFee();
  }
}

export class RateDiscountCoupon extends Coupon {
  public readonly phase = CouponPhase.RATE;
  private readonly discountRate: number;

  constructor({
    conditions,
    discountRate,
    expirationDate,
  }: {
    conditions: DiscountCondition[];
    discountRate: number;
    expirationDate?: Date;
  }) {
    super(conditions, `${discountRate}% 시간제 할인 쿠폰`, expirationDate);
    this.discountRate = discountRate;
  }

  public getDiscountPrice(orderContext: OrderContext, basePrice?: number) {
    const price = basePrice ?? orderContext.calculateOrderPrice();
    return price * (this.discountRate / 100);
  }
}
