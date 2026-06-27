import { CouponEntity } from "../coupon.entity.js";
import {
  Coupon,
  CouponProps,
  CouponResult,
  Bogo,
  CouponStatus,
  DiscountView,
  ItemRule,
} from "../coupon.type.js";
import { filterByItemRule } from "../item-rule.js";

interface BogoCouponProps {
  id: string;
  name: string;
  expiriationDate: Date;
  discountType: Bogo;
  itemRule: ItemRule;
}

export default class BogoCoupon implements Coupon {
  readonly id: string;
  readonly name: string;
  readonly expiriationDate: Date;
  readonly discountType: Bogo;
  readonly itemRule: ItemRule;

  constructor(props: BogoCouponProps) {
    this.id = props.id;
    this.name = props.name;
    this.expiriationDate = props.expiriationDate;
    this.discountType = props.discountType;
    this.itemRule = props.itemRule;
  }

  static from(entity: CouponEntity): BogoCoupon {
    return new BogoCoupon({
      id: entity.id,
      name: entity.name,
      expiriationDate: new Date(entity.expiriation_date),
      discountType: { type: "BOGO", getQuantity: 1 },
      itemRule: { type: "MIN_QUANTITY", minQuantity: 2 },
    });
  }

  canUse({ checkoutCartList }: CouponProps): CouponStatus {
    if (new Date() > this.expiriationDate)
      return { type: "UNUSABLE", message: `만료일: ${this.expiriationDate}` };
    if (filterByItemRule(checkoutCartList, this.itemRule).length === 0)
      return {
        type: "UNUSABLE",
        message: `${this.itemRule.minQuantity}개 이상이여야 사용할 수 있는 쿠폰입니다`,
      };

    return { type: "USABLE", message: "" };
  }

  discountView(): DiscountView {
    return { type: "FIXED", amount: 0 };
  }

  execute(args: CouponProps): CouponResult {
    const { getQuantity } = this.discountType;
    const { checkoutCartList, gifts } = args;
    const giftTarget = filterByItemRule(checkoutCartList, this.itemRule).sort(
      (a, b) => b.price - a.price,
    )[0];

    if (!giftTarget) return args;

    return {
      ...args,
      gifts: [...gifts, { productId: giftTarget.productId, quantity: getQuantity }],
    };
  }
}
