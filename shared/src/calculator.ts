import {
  Coupon,
  DELIVERY_RULES,
  GiftItem,
  OrderReceipt,
  PreorderItem,
} from './types.js';

export const calculateOrderAmount = (items: PreorderItem[]): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

export const calculateBogoDiscount = (
  items: PreorderItem[],
  bogoCoupon: Coupon,
): number => {
  const minQuantity = bogoCoupon.condition.minBogoQuantity ?? 2;
  const bogoTargets = items.filter((item) => item.quantity >= minQuantity);
  if (bogoTargets.length === 0) return 0;

  const expensiveItem = bogoTargets.reduce(
    (max, item) => (item.price > max.price ? item : max),
    bogoTargets[0],
  );

  return expensiveItem.price;
};

export const calculateBaseShippingFee = (
  orderAmount: number,
  isRemoteArea: boolean,
): number => {
  if (orderAmount === 0 || orderAmount >= DELIVERY_RULES.FREE_DELIVERY_LIMIT) {
    return 0;
  }

  return isRemoteArea
    ? DELIVERY_RULES.BASE_DELIVERY_FEE + DELIVERY_RULES.JEJU_EXTRA_FEE
    : DELIVERY_RULES.BASE_DELIVERY_FEE;
};

const extractGiftItems = (
  items: PreorderItem[],
  bogoCoupon?: Coupon,
): GiftItem[] => {
  if (!bogoCoupon) return [];

  const minQuantity = bogoCoupon.condition.minBogoQuantity ?? 2;
  const bogoTargets = items.filter((item) => item.quantity >= minQuantity);

  if (bogoTargets.length === 0) return [];

  const target = bogoTargets.reduce(
    (max, item) => (item.price > max.price ? item : max),
    bogoTargets[0],
  );
  const freeQuantity = bogoCoupon.benefit.bogoFreeQuantity ?? 1;

  return [{ productId: target.productId, giftQuantity: freeQuantity }];
};

const calculateRateDiscount = (
  amount: number,
  coupons: Coupon[],
  currentTime: Date,
): number => {
  return coupons.reduce((sum, coupon) => {
    const hour = currentTime.getHours();
    const startHour = coupon.condition.validTime?.startHour ?? 4;
    const endHour = coupon.condition.validTime?.endHour ?? 7;
    const discountRate = coupon.benefit.discountRate ?? 0;

    if (hour >= startHour && hour < endHour) return sum + amount * discountRate;
    return sum;
  }, 0);
};

export const generateOrderReceipt = (
  items: PreorderItem[],
  selectedCoupons: Coupon[],
  isRemoteArea: boolean,
  currentTime: Date,
): OrderReceipt => {
  const orderAmount = calculateOrderAmount(items);
  const discountCoupons = selectedCoupons.filter(
    (coupon) => coupon.type === 'DISCOUNT',
  );
  const bogoCoupon = selectedCoupons.find((coupon) => coupon.type === 'BOGO');
  const rateCoupons = selectedCoupons.filter(
    (coupon) => coupon.type === 'TIMESALE',
  );
  const hasFreeShippingCoupon = selectedCoupons.some(
    (coupon) => coupon.type === 'FREESHIPPING',
  );

  const fixedDiscount = discountCoupons.reduce(
    (sum, coupon) => sum + (coupon.benefit.discountAmount ?? 0),
    0,
  );
  const rateDiscount = calculateRateDiscount(
    orderAmount - fixedDiscount,
    rateCoupons,
    currentTime,
  );

  const baseShippingFee = calculateBaseShippingFee(orderAmount, isRemoteArea);

  const totalProductDiscount = fixedDiscount + rateDiscount;
  const shippingDiscount = hasFreeShippingCoupon ? baseShippingFee : 0;

  const totalCashDiscount = totalProductDiscount + shippingDiscount;
  const totalPaymentAmount = orderAmount + baseShippingFee - totalCashDiscount;

  return {
    priceSummary: {
      orderAmount,
      discountAmount: totalCashDiscount,
      shippingFee: baseShippingFee,
      totalPaymentAmount,
    },
    giftItems: extractGiftItems(items, bogoCoupon),
  };
};
