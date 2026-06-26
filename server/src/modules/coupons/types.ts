type DiscountInfo =
  | {
      type: "percentage";
      value: number;
    }
  | {
      type: "fixed";
      value: number;
    }
  | {
      type: "freeShipping";
    }
  | {
      type: "bogo";
      target: "max";
      requireAmount: number;
    };

export interface DiscountContextItem {
  productId: string;
  price: number;
  quantity: number;
}

export interface DiscountContext {
  orderPrice: number;
  deliveryFee: number;
  items: DiscountContextItem[];
}

export interface CouponDB {
  couponId: string;
  couponName: string;
  isDisabled: boolean;
  couponExpiration: number;
  discountInfo: DiscountInfo & {
    minimumOrderPrice: number;
    duration: {
      startDate: number;
      endDate: number;
    };
  };
}
