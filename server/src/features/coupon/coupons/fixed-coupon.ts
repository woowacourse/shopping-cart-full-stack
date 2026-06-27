import { CouponEntity } from "../coupon.entity.js";
import {
  Coupon,
  CouponProps,
  CouponResult,
  CouponStatus,
  DiscountView,
  Fixed,
  LowPrice,
} from "../coupon.type.js";

interface FixedCouponProps {
  id: string;
  name: string;
  expiriationDate: Date;
  discountType: Fixed;
  rule: LowPrice;
}

export default class FixedCoupon implements Coupon {
  readonly id: string;
  readonly name: string;
  readonly expiriationDate: Date;
  readonly discountType: Fixed;
  readonly rule: LowPrice;

  constructor(props: FixedCouponProps) {
    this.id = props.id;
    this.name = props.name;
    this.expiriationDate = props.expiriationDate;
    this.discountType = props.discountType;
    this.rule = props.rule;
  }

  static from(entity: CouponEntity): FixedCoupon {
    if (entity.discount_fixed === null || entity.limit_price === null) {
      throw new Error("쿠폰 데이터가 올바르지 않습니다");
    }
    return new FixedCoupon({
      id: entity.id,
      name: entity.name,
      expiriationDate: new Date(entity.expiriation_date),
      discountType: {
        type: "FIXED",
        discountFixed: entity.discount_fixed,
      },
      rule: { type: "LOW_PRICE", price: entity.limit_price },
    });
  }

  canUse({ summary }: CouponProps): CouponStatus {
    if (new Date() > this.expiriationDate)
      return { type: "UNUSABLE", message: "만료된 쿠폰입니다" };
    if (summary.orderPrice < this.rule.price)
      return { type: "UNUSABLE", message: "최소 주문 금액을 충족하지 못했습니다" };
    return { type: "USABLE", message: "" };
  }

  discountView(): DiscountView {
    return { type: "FIXED", amount: this.discountType.discountFixed };
  }

  execute(args: CouponProps): CouponResult {
    const { summary } = args;
    const discountPrice = summary.discountPrice + this.discountType.discountFixed;
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
