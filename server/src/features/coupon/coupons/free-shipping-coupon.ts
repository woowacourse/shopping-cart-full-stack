import { CouponEntity } from "../coupon.entity.js";
import {
  Coupon,
  CouponProps,
  CouponResult,
  CouponStatus,
  DiscountView,
  FreeShipping,
  LowPrice,
} from "../coupon.type.js";

interface FixedCouponProps {
  id: string;
  name: string;
  expiriationDate: Date;
  discountType: FreeShipping;
  rule: LowPrice;
}

export default class FreeShippingCoupon implements Coupon {
  readonly id: string;
  readonly name: string;
  readonly expiriationDate: Date;
  readonly discountType: FreeShipping;
  readonly rule: LowPrice;

  constructor(props: FixedCouponProps) {
    this.id = props.id;
    this.name = props.name;
    this.expiriationDate = props.expiriationDate;
    this.discountType = props.discountType;
    this.rule = props.rule;
  }

  static from(entity: CouponEntity): FreeShippingCoupon {
    if (entity.limit_price === null) {
      throw new Error("쿠폰 데이터가 올바르지 않습니다");
    }
    return new FreeShippingCoupon({
      id: entity.id,
      name: entity.name,
      expiriationDate: new Date(entity.expiriation_date),
      discountType: {
        type: "FREESHIPPING",
      },
      rule: { type: "LOW_PRICE", price: entity.limit_price },
    });
  }

  canUse({ summary }: CouponProps): CouponStatus {
    if (new Date() > this.expiriationDate)
      return { type: "UNUSABLE", message: "만료된 쿠폰입니다" };
    if (summary.orderPrice < this.rule.price)
      return { type: "UNUSABLE", message: "최소 주문 금액을 충족하지 못했습니다" };
    if (summary.deliveryPrice === 0)
      return { type: "UNUSABLE", message: "이미 무료 배송이에요" };
    return { type: "USABLE", message: "" };
  }

  discountView({ summary }: CouponProps): DiscountView {
    return { type: "FIXED", amount: summary.deliveryPrice };
  }

  execute(args: CouponProps): CouponResult {
    const { summary } = args;
    const discountPrice = summary.discountPrice + summary.deliveryPrice;
    return {
      ...args,
      summary: {
        ...summary,
        discountPrice,
        totalPrice: summary.orderPrice - discountPrice + summary.deliveryPrice,
      },
    };
  }
}
