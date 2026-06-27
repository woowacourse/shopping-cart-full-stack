import type { CouponItem } from "../types/order";

const isWithinAvailableTime = (coupon: CouponItem, now: Date): boolean => {
  if (!coupon.availableTime) return true;
  const [startHour, startMin] = coupon.availableTime.start.split(":").map(Number);
  const [endHour, endMin] = coupon.availableTime.end.split(":").map(Number);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return (
    nowMinutes >= startHour * 60 + startMin &&
    nowMinutes < endHour * 60 + endMin
  );
};

const calculateSingleDiscount = (
  coupon: CouponItem,
  orderTotal: number,
  deliveryFee: number,
  now: Date,
): number => {
  const meetsMinimum = !coupon.minimumAmount || orderTotal >= coupon.minimumAmount;

  switch (coupon.discountType) {
    case "fixed":
      return meetsMinimum ? coupon.discountValue : 0;
    case "freeShipping":
      return meetsMinimum ? deliveryFee : 0;
    case "buyXgetY":
      return 0;
    case "percentage":
      if (!isWithinAvailableTime(coupon, now)) return 0;
      return orderTotal * (coupon.discountValue / 100);
    default:
      return 0;
  }
};

export const calculateCouponDiscount = (
  selectedCoupons: CouponItem[],
  orderTotal: number,
  deliveryFee: number,
  now: Date = new Date(),
): number => {
  const fixedDiscount = selectedCoupons
    .filter((c) => c.discountType === "fixed")
    .reduce(
      (sum, c) => sum + calculateSingleDiscount(c, orderTotal, deliveryFee, now),
      0,
    );

  const discountedTotal = Math.max(0, orderTotal - fixedDiscount);
  const percentageDiscount = selectedCoupons
    .filter((c) => c.discountType === "percentage")
    .reduce((sum, c) => {
      if (!isWithinAvailableTime(c, now)) return sum;
      return sum + discountedTotal * (c.discountValue / 100);
    }, 0);

  const shippingDiscount = selectedCoupons
    .filter((c) => c.discountType === "freeShipping")
    .reduce((sum, c) => {
      const meetsMinimum = !c.minimumAmount || orderTotal >= c.minimumAmount;
      return sum + (meetsMinimum ? deliveryFee : 0);
    }, 0);

  return fixedDiscount + percentageDiscount + shippingDiscount;
};
