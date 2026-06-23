import type {
  BogoCoupon,
  Coupon,
  FixedAmountCoupon,
  FreeShippingCoupon,
  OrderData,
  PercentageCoupon,
} from '../types/type.ts';

function convertTimeToMinutes(time: string) {
  const [hours, minutes] = time.split(':').map(Number);

  return hours * 60 + minutes;
}

function getCurrentTime(date: Date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
}

function calculateFixedAmountDiscount(
  order: OrderData,
  coupon: FixedAmountCoupon,
) {
  if (order.amount.orderAmount < coupon.minOrderAmount) {
    return 0;
  }

  return coupon.discountAmount;
}

function calculateBogoDiscount(order: OrderData, coupon: BogoCoupon) {
  const discountProduct = order.products
    .filter((product) => product.quantity >= coupon.minCount)
    .sort((a, b) => b.price - a.price)[0];

  if (!discountProduct) {
    return 0;
  }

  return discountProduct.price * coupon.freeCount;
}

function calculateFreeShippingDiscount(
  order: OrderData,
  coupon: FreeShippingCoupon,
) {
  if (order.amount.orderAmount < coupon.minOrderAmount) {
    return 0;
  }

  const discountLimit = order.isRemoteArea
    ? coupon.discountAmount + coupon.remoteAreaFee
    : coupon.discountAmount;

  return Math.min(order.amount.shippingFee, discountLimit);
}

function calculatePercentageDiscountByAmount(
  amount: number,
  coupon: PercentageCoupon,
  currentDate: Date,
) {
  const currentTime = getCurrentTime(currentDate);
  const currentMinutes = convertTimeToMinutes(currentTime);
  const startMinutes = convertTimeToMinutes(coupon.startTime);
  const endMinutes = convertTimeToMinutes(coupon.endTime);

  if (currentMinutes < startMinutes || currentMinutes >= endMinutes) {
    return 0;
  }

  return Math.floor((amount * coupon.discountRate) / 100);
}

function calculateProductCouponDiscount(order: OrderData, coupon: Coupon) {
  switch (coupon.code) {
    case 'FIXED5000':
      return calculateFixedAmountDiscount(order, coupon);
    case 'BOGO':
      return calculateBogoDiscount(order, coupon);
    case 'FREESHIPPING':
    case 'MIRACLESALE':
      return 0;
  }
}

function calculateProductDiscount(order: OrderData, coupons: Coupon[]) {
  return coupons.reduce((discountAmount, coupon) => {
    return discountAmount + calculateProductCouponDiscount(order, coupon);
  }, 0);
}

function calculatePercentageDiscount(
  discountBaseAmount: number,
  coupons: Coupon[],
  currentDate: Date,
) {
  return coupons.reduce((discountAmount, coupon) => {
    if (coupon.code !== 'MIRACLESALE') {
      return discountAmount;
    }

    return (
      discountAmount +
      calculatePercentageDiscountByAmount(
        discountBaseAmount,
        coupon,
        currentDate,
      )
    );
  }, 0);
}

function calculateShippingDiscount(order: OrderData, coupons: Coupon[]) {
  return coupons.reduce((discountAmount, coupon) => {
    if (coupon.code !== 'FREESHIPPING') {
      return discountAmount;
    }

    return discountAmount + calculateFreeShippingDiscount(order, coupon);
  }, 0);
}

function calculateCouponDiscountAmount(
  order: OrderData,
  coupons: Coupon[],
  currentDate: Date,
) {
  const productDiscount = calculateProductDiscount(order, coupons);
  const discountBaseAmount = order.amount.orderAmount - productDiscount;

  const percentageDiscount = calculatePercentageDiscount(
    discountBaseAmount,
    coupons,
    currentDate,
  );
  const shippingDiscount = calculateShippingDiscount(order, coupons);

  return productDiscount + percentageDiscount + shippingDiscount;
}

function createCouponCombinations(coupons: Coupon[], maxSize: number) {
  const combinations: Coupon[][] = [];

  coupons.forEach((coupon, index) => {
    combinations.push([coupon]);

    if (maxSize < 2) {
      return;
    }

    coupons.slice(index + 1).forEach((nextCoupon) => {
      combinations.push([coupon, nextCoupon]);
    });
  });

  return combinations;
}

function findBestCouponCombination(
  order: OrderData,
  coupons: Coupon[],
  currentDate: Date,
) {
  const validCoupons = coupons.filter((coupon) => {
    return calculateCouponDiscountAmount(order, [coupon], currentDate) > 0;
  });
  const combinations = createCouponCombinations(validCoupons, 2);

  return combinations.reduce<Coupon[]>((bestCombination, combination) => {
    const maxDiscountAmount = calculateCouponDiscountAmount(
      order,
      bestCombination,
      currentDate,
    );
    const currentDiscountAmount = calculateCouponDiscountAmount(
      order,
      combination,
      currentDate,
    );

    return currentDiscountAmount > maxDiscountAmount
      ? combination
      : bestCombination;
  }, []);
}

export function calculateBestCouponDiscount(
  order: OrderData,
  coupons: Coupon[],
  currentDate: Date,
) {
  const selectedCoupons = findBestCouponCombination(
    order,
    coupons,
    currentDate,
  );
  const discountAmount = calculateCouponDiscountAmount(
    order,
    selectedCoupons,
    currentDate,
  );

  return { selectedCoupons, discountAmount };
}

export function calculateSelectedCouponDiscount(
  order: OrderData,
  selectedCoupons: Coupon[],
  currentDate: Date,
) {
  const discountAmount = calculateCouponDiscountAmount(
    order,
    selectedCoupons,
    currentDate,
  );

  return { selectedCoupons, discountAmount };
}
