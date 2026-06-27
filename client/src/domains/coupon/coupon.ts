export type CouponDiscountPolicy = {
  discountType: "FIXED" | "RATE" | "SHIPPING";
  discountValue: number;
};

export function calculateTotalCouponDiscount(
  coupons: CouponDiscountPolicy[],
  totalPrice: number,
) {
  const sortedCoupons = [...coupons].sort((a, b) => {
    if (a.discountType === "RATE") return 1;
    if (b.discountType === "RATE") return -1;
    return 0;
  });

  let calculatedDiscount = 0;
  let totalAmount = totalPrice;

  for (const coupon of sortedCoupons) {
    if (coupon.discountType === "FIXED") {
      const fixedDiscount = coupon.discountValue;
      calculatedDiscount += fixedDiscount;
      totalAmount -= fixedDiscount;
    }

    if (coupon.discountType === "SHIPPING") {
      const shippingDiscount = coupon.discountValue;
      calculatedDiscount += shippingDiscount;
    }

    if (coupon.discountType === "RATE") {
      const rateDiscount = Math.floor(
        totalAmount * (coupon.discountValue / 100),
      );

      calculatedDiscount += rateDiscount;
      totalAmount -= rateDiscount;
    }
  }

  return calculatedDiscount;
}
