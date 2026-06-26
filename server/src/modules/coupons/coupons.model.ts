export type CouponCondition =
  | {
      validTime: {
        start: string;
        end: string;
      };
    }
  | { minOrderAmount: number }
  | {
      buyQuantity: number;
      freeQuantity: number;
    };

export class Coupon {
  id: number;
  code: string;
  name: string;

  expirationDate: string;

  discount: unknown;
  condition: CouponCondition;

  constructor({
    id,
    code,
    name,
    expirationDate,
    discount,
    condition,
  }: {
    id: number;
    code: string;
    name: string;
    expirationDate: string;

    discount: unknown;

    condition: CouponCondition;
  }) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.expirationDate = expirationDate;

    this.discount = discount;
    this.condition = condition;
  }
}
