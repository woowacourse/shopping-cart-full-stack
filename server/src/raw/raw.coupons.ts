// discount
interface FixedAmountDiscount {
  type: "fixedAmount";
  amount: number;
}

interface PercentDiscount {
  type: "percent";
  rate: number;
}

interface FreeShippingFeeDiscount {
  type: "freeShippingFee";
}

interface BuyXGetYDiscount {
  type: "buyXGetY";
  buyQuantity: number;
  freeQuantity: number;
}

// condition

interface CouponCondition {
  minOrderAmount?: number;
  buyQuantity?: number;
  freeQuantity?: number;
  validTime?: {
    start: string;
    end: string;
  };
}

interface RawCoupon {
  id: number;
  code: string;
  name: string;

  discount:
    | FixedAmountDiscount
    | PercentDiscount
    | FreeShippingFeeDiscount
    | BuyXGetYDiscount;

  expirationDate: string;

  condition: CouponCondition;
}

const createCoupons = () => {
  const rawCoupons: RawCoupon[] = [
    {
      id: 1,
      code: "FIXED5000",
      name: "5,000원 할인 쿠폰",
      expirationDate: "2026-11-30",
      discount: {
        type: "fixedAmount",
        amount: 5000,
      },
      condition: {
        minOrderAmount: 100000,
      },
    },
    {
      id: 2,
      code: "BOGO",
      name: "2개 구매 시 1개 무료 쿠폰",
      expirationDate: "2026-06-30",
      discount: {
        type: "buyXGetY",
        buyQuantity: 2,
        freeQuantity: 1,
      },
      condition: {
        buyQuantity: 2,
        freeQuantity: 1,
      },
    },
    {
      id: 3,
      code: "FREESHIPPING",
      name: "5만원 이상 구매 시 무료 배송 쿠폰",
      expirationDate: "2026-08-31",
      discount: {
        type: "freeShippingFee",
      },
      condition: {
        minOrderAmount: 50000,
      },
    },
    {
      id: 4,
      code: "MIRACLESALE",
      name: "미라클모닝 30% 할인 쿠폰",
      expirationDate: "2026-07-31",
      discount: {
        type: "percent",
        rate: 0.3,
      },
      condition: {
        validTime: {
          start: "04:00",
          end: "07:00",
        },
      },
    },
  ];
  return rawCoupons;
};

export const couponStore = {
  coupons: createCoupons(),
  reset() {
    this.coupons = createCoupons();
  },
};
