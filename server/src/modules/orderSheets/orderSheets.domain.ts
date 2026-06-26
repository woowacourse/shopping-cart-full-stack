export const calculateOrderSheetAmount = (
  products: { price: number; quantity: number }[],
): number => {
  return products.reduce((acc, product) => {
    acc += product.price * product.quantity;
    return acc;
  }, 0);
};

export const calculateAppliedShippingFee = (
  orderSheetAmount: number,
  isRemoteArea: boolean,
  hasFreeShippingFeeCoupon: boolean,
  shippingPolicy: {
    baseShippingFee: number;
    remoteAreaAdditionalFee: number;
    freeShippingThreshold: number;
  },
): number => {
  if (orderSheetAmount >= shippingPolicy.freeShippingThreshold) return 0;
  if (hasFreeShippingFeeCoupon) return 0;

  if (isRemoteArea)
    return (
      shippingPolicy.baseShippingFee + shippingPolicy.remoteAreaAdditionalFee
    );

  return shippingPolicy.baseShippingFee;
};

export const calculateCouponDiscountAmount = (
  products: { price: number; quantity: number }[],
  coupons: string[],
  shippingFreeBeforeCoupon: number,
): number => {
  const couponOrder = ["FIXED5000", "BOGO", "MIRACLESALE", "FREESHIPPING"];

  const orderedCoupons: string[] = [];
  couponOrder.forEach((order) => {
    if (coupons.includes(order)) orderedCoupons.push(order);
  });

  const calculateCouponDiscount = {
    fixedAmount: (discount: { type: "fixedAmount"; amount: number }) => {
      return discount.amount;
    },
    buyXGetY: (
      discount: { type: "buyXGetY"; buyQuantity: number; freeQuantity: number },
      products: { price: number; quantity: number }[],
    ) => {
      const getMaxPriceProductPrice = (
        products: { price: number; quantity: number }[],
      ): number => {
        const bogoProducts = products.filter(
          (product) =>
            product.quantity >= discount.buyQuantity + discount.freeQuantity,
        );
        const sortedProduct = bogoProducts.sort((a, b) => b.price - a.price);

        const maxPriceProduct = sortedProduct[0];

        return maxPriceProduct.price * discount.freeQuantity;
      };

      const maxPriceProduct = getMaxPriceProductPrice(products);
      return maxPriceProduct;
    },
    percent: (
      discount: { type: "percent"; rate: number },
      products: { price: number; quantity: number }[],
      prevDiscountAmount: number,
    ) => {
      const orderSheetAmount =
        calculateOrderSheetAmount(products) - prevDiscountAmount;
      return orderSheetAmount * discount.rate;
    },
    freeShippingFee: (
      discount: { type: "freeShippingFee" },
      products: { price: number; quantity: number }[],
    ) => {
      return shippingFreeBeforeCoupon;
    },
  };

  const couponCODEs = {
    FIXED5000: {
      type: "fixedAmount",
      amount: 5000,
    },
    BOGO: {
      type: "buyXGetY",
      buyQuantity: 2,
      freeQuantity: 1,
    },
    MIRACLESALE: {
      type: "percent",
      rate: 0.3,
    },
    FREESHIPPING: {
      type: "freeShippingFee",
    },
  };

  return orderedCoupons.reduce((prevDiscountAmount: number, coupon: string) => {
    const discount = couponCODEs[coupon as keyof typeof couponCODEs];
    if (!discount) return prevDiscountAmount;

    const discountType = discount.type;

    const calculate =
      calculateCouponDiscount[
        discountType as keyof typeof calculateCouponDiscount
      ];
    if (!calculate) return prevDiscountAmount;

    prevDiscountAmount += calculate(discount, products, prevDiscountAmount);
    return prevDiscountAmount;
  }, 0);
};

export const calculatePaymentAmount = (
  orderSheetAmount: number,
  couponDiscountAmount: number,
  appliedShippingFee: number,
): number => {
  return orderSheetAmount - couponDiscountAmount + appliedShippingFee;
};

const isExpired = (expirationDateString: string, now: Date): boolean => {
  const expirationDate = new Date(`${expirationDateString}T23:59:59`);

  return now > expirationDate;
};

const isValidTime = (
  validTime: { start: string; end: string },
  now: Date,
): boolean => {
  const [startHour, startMinute] = validTime.start.split(":").map(Number);
  const [endHour, endMinute] = validTime.end.split(":").map(Number);

  const nowMinute = now.getHours() * 60 + now.getMinutes();
  const startMinuteTotal = startHour * 60 + startMinute;
  const endMinuteTotal = endHour * 60 + endMinute;

  return startMinuteTotal <= nowMinute && nowMinute <= endMinuteTotal;
};

interface FIXE5000Coupon {
  code: "FIXED5000";
  expirationDate: string;
  condition: {
    minOrderAmount: number;
  };
}
interface FIXE5000CouponContext {
  orderSheetAmount: number;
}

interface BOGOCoupon {
  code: "BOGO";
  expirationDate: string;
  condition: {
    buyQuantity: number;
    freeQuantity: number;
  };
}
interface BOGOCouponContext {
  products: { price: number; quantity: number }[];
}

interface FREESHIPPINGCoupon {
  code: "FREESHIPPING";
  expirationDate: string;
  condition: {
    minOrderAmount: number;
  };
}
interface FREESHIPPINGCoupontContext {
  orderSheetAmount: number;
}

interface MIRACLESALECoupon {
  code: "MIRACLESALE";
  expirationDate: string;
  condition: {
    validTime: {
      start: string;
      end: string;
    };
  };
}
interface MIRACLESALECouponContext {}

export type CanUseCoupon =
  | FIXE5000Coupon
  | BOGOCoupon
  | FREESHIPPINGCoupon
  | MIRACLESALECoupon;
export type CanUseCouponContext = (
  | FIXE5000CouponContext
  | BOGOCouponContext
  | FREESHIPPINGCoupontContext
  | MIRACLESALECouponContext
) & { now: Date };

export const canUseCoupon = (
  coupon: CanUseCoupon,
  context: CanUseCouponContext,
) => {
  const { expirationDate } = coupon;
  const { now } = context;

  if (isExpired(expirationDate, now)) return false;

  const { condition } = coupon;

  switch (coupon.code) {
    case "FIXED5000":
      return context.orderSheetAmount >= condition.minOrderAmount;

    case "BOGO":
      const bogoProduct = context.products?.find((product) => {
        return (
          product.quantity >= condition.buyQuantity + condition.freeQuantity
        );
      });
      return !!bogoProduct;

    case "FREESHIPPING":
      return context.orderSheetAmount >= condition.minOrderAmount;

    case "MIRACLESALE":
      return isValidTime(condition.validTime, now);

    default:
      return false;
  }
};

const getAllCouponCombination = (
  coupons: string[],
): ([string] | [string, string])[] => {
  const cases: ([string] | [string, string])[] = [];
  coupons.forEach((coupon: string, index: number) => {
    for (let i = index; i < coupons.length; i++) {
      cases.push([coupons[index]]);
      if (coupons[index] !== coupons[i]) {
        const caseData: [string, string] = [coupons[index], coupons[i]];
        cases.push(caseData);
      }
    }
  });
  return cases;
};

export const calculateBestCouponCombination = (
  products: { price: number; quantity: number }[],
  coupons: string[],
  shippingFeeBeforeCoupon: number,
) => {
  const allCouponCase = getAllCouponCombination(coupons);

  const discountAmountWithCouponCombination = allCouponCase
    .map((coupons) => {
      const discountAmount = calculateCouponDiscountAmount(
        products,
        coupons,
        shippingFeeBeforeCoupon,
      );

      return { coupons, discountAmount };
    })
    .sort((a, b) => b.discountAmount - a.discountAmount);

  const maxDiscountAmountWithCouponCombination =
    discountAmountWithCouponCombination[0];

  if (!maxDiscountAmountWithCouponCombination) return [];

  return maxDiscountAmountWithCouponCombination.coupons;
};
