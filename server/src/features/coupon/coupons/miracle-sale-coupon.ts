import { CouponEntity } from "../coupon.entity.js";
import {
  Coupon,
  CouponProps,
  CouponResult,
  CouponStatus,
  DiscountView,
  MiralceSale,
  Time,
} from "../coupon.type.js";

interface MiracleSaleCouponProps {
  id: string;
  name: string;
  expiriationDate: Date;
  discountType: MiralceSale;
  rule: Time;
}

export default class MiracleSaleCoupon implements Coupon {
  readonly id: string;
  readonly name: string;
  readonly expiriationDate: Date;
  readonly discountType: MiralceSale;
  readonly rule: Time;

  constructor(props: MiracleSaleCouponProps) {
    this.id = props.id;
    this.name = props.name;
    this.expiriationDate = props.expiriationDate;
    this.discountType = props.discountType;
    this.rule = props.rule;
  }

  static from(entity: CouponEntity): MiracleSaleCoupon {
    if (entity.start_time === null || entity.end_time === null || entity.discount_rate === null) {
      throw new Error("쿠폰 데이터가 올바르지 않습니다");
    }
    return new MiracleSaleCoupon({
      id: entity.id,
      name: entity.name,
      expiriationDate: new Date(entity.expiriation_date),
      discountType: {
        type: "MIRACLESALE",
        discountRate: entity.discount_rate,
      },
      rule: { type: "TIME", startAt: entity.start_time, endAt: entity.end_time },
    });
  }

  canUse(): CouponStatus {
    if (new Date() > this.expiriationDate)
      return { type: "UNUSABLE", message: "만료된 쿠폰입니다" };

    const kstDate = new Date(new Date().getTime() + 9 * 60 * 60 * 1000);
    const now = kstDate.toISOString().slice(11, 16);

    if (now < this.rule.startAt || now >= this.rule.endAt)
      return { type: "UNUSABLE", message: "사용 가능 시간이 아니에요" };
    return { type: "USABLE", message: "" };
  }

  discountView(): DiscountView {
    return { type: "RATE", rate: this.discountType.discountRate };
  }

  execute(args: CouponProps): CouponResult {
    const { summary } = args;
    const discountedPrice = summary.orderPrice - summary.discountPrice;
    const discountRate = Math.floor((discountedPrice * this.discountType.discountRate) / 100);
    const discountPrice = summary.discountPrice + discountRate;
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
