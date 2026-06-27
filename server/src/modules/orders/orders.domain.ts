import type { CartItem, Coupon } from "@/type";

const isWithinAvailableTime = (coupon: Coupon, now: Date): boolean => {
  if (!coupon.availableTime) return true;
  const [startHour, startMin] = coupon.availableTime.start
    .split(":")
    .map(Number);
  const [endHour, endMin] = coupon.availableTime.end.split(":").map(Number);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return (
    nowMinutes >= startHour * 60 + startMin &&
    nowMinutes < endHour * 60 + endMin
  );
};

const calculateDiscountAmount = (
  coupon: Coupon,
  cartItems: CartItem[],
  orderTotal: number,
  deliveryFee: number,
  now: Date,
): number => {
  const meetsMinimum =
    !coupon.minimumAmount || orderTotal >= coupon.minimumAmount;

  switch (coupon.discountType) {
    case "fixed":
      return meetsMinimum ? coupon.discountValue : 0;

    case "freeShipping":
      return meetsMinimum ? deliveryFee : 0;

    case "buyXgetY": {
      const eligibleItems = cartItems.filter((item) => item.quantity >= 2);
      if (eligibleItems.length === 0) return 0;
      return Math.max(...eligibleItems.map((item) => item.product.price));
    }

    case "percentage":
      if (!isWithinAvailableTime(coupon, now)) return 0;
      return orderTotal * (coupon.discountValue / 100);
  }
};

const calculateCombinedDiscount = (
  combination: Coupon[],
  cartItems: CartItem[],
  orderTotal: number,
  deliveryFee: number,
  now: Date,
): number => {
  // 정액 쿠폰 먼저 적용 (fixed, buyXgetY)
  const fixedDiscount = combination
    .filter((c) => c.discountType === "fixed")
    .reduce(
      (sum, c) =>
        sum +
        calculateDiscountAmount(c, cartItems, orderTotal, deliveryFee, now),
      0,
    );

  // 정율 쿠폰은 할인된 금액에 적용
  const discountedTotal = Math.max(0, orderTotal - fixedDiscount);
  const percentageDiscount = combination
    .filter((c) => c.discountType === "percentage")
    .reduce((sum, c) => {
      if (!isWithinAvailableTime(c, now)) return sum;
      return sum + discountedTotal * (c.discountValue / 100);
    }, 0);

  // 배송비 쿠폰은 orderTotal과 독립적으로 적용해서 계산 -> 주문 금액을 기준으로
  const shippingDiscount = combination
    .filter((c) => c.discountType === "freeShipping")
    .reduce((sum, c) => {
      const meetsMinimum = !c.minimumAmount || orderTotal >= c.minimumAmount;
      return sum + (meetsMinimum ? deliveryFee : 0);
    }, 0);

  return fixedDiscount + percentageDiscount + shippingDiscount;
};

export const calculateFinalAmount = (
  coupons: Coupon[],
  cartItems: CartItem[],
  orderTotal: number,
  deliveryFee: number,
  now: Date = new Date(),
): number => {
  const totalDiscount = calculateCombinedDiscount(
    coupons,
    cartItems,
    orderTotal,
    deliveryFee,
    now,
  );
  return Math.max(0, orderTotal + deliveryFee - totalDiscount);
};

export const calcOrderBreakdown = (
  appliedCoupons: Coupon[],
  cartItems: CartItem[],
  deliveryFee: number,
  now: Date = new Date(),
): { orderAmount: number; couponDiscount: number; shippingDiscount: number; totalAmount: number } => {
  const orderAmount = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const fixedDiscount = appliedCoupons
    .filter((c) => c.discountType === "fixed")
    .reduce((sum, c) => {
      const meetsMinimum = !c.minimumAmount || orderAmount >= c.minimumAmount;
      return sum + (meetsMinimum ? c.discountValue : 0);
    }, 0);

  const discountedTotal = Math.max(0, orderAmount - fixedDiscount);
  const percentageDiscount = appliedCoupons
    .filter((c) => c.discountType === "percentage")
    .reduce((sum, c) => {
      if (!isWithinAvailableTime(c, now)) return sum;
      return sum + discountedTotal * (c.discountValue / 100);
    }, 0);

  const shippingDiscount = appliedCoupons
    .filter((c) => c.discountType === "freeShipping")
    .reduce((sum, c) => {
      const meetsMinimum = !c.minimumAmount || orderAmount >= c.minimumAmount;
      return sum + (meetsMinimum ? deliveryFee : 0);
    }, 0);

  const couponDiscount = fixedDiscount + percentageDiscount;
  const totalAmount = Math.max(0, orderAmount + deliveryFee - couponDiscount - shippingDiscount);

  return { orderAmount, couponDiscount, shippingDiscount, totalAmount };
};

export const findBogoGiftProductId = (cartItems: CartItem[]): number | null => {
  const eligible = cartItems.filter((item) => item.quantity >= 2);
  if (eligible.length === 0) return null;
  return eligible.reduce((max, item) =>
    item.product.price > max.product.price ? item : max,
  ).product.id;
};

export const isCouponUsable = (
  coupon: Coupon,
  cartItems: CartItem[],
  orderTotal: number,
  now: Date = new Date(),
): boolean => {
  const expirationDay = new Date(coupon.expirationDate);
  expirationDay.setHours(23, 59, 59, 999);
  if (expirationDay < now) return false;

  if (coupon.minimumAmount && orderTotal < coupon.minimumAmount) return false;

  if (!isWithinAvailableTime(coupon, now)) return false;

  if (coupon.discountType === "buyXgetY") {
    const hasEligibleItem = cartItems.some((item) => item.quantity >= 2);
    if (!hasEligibleItem) return false;
  }

  return true;
};

export const selectTopTwoCoupons = (
  coupons: Coupon[],
  cartItems: CartItem[],
  orderTotal: number,
  deliveryFee: number,
  now: Date = new Date(),
): Coupon[] => {
  if (coupons.length <= 2) {
    return [...coupons].sort(
      (a, b) =>
        calculateDiscountAmount(b, cartItems, orderTotal, deliveryFee, now) -
        calculateDiscountAmount(a, cartItems, orderTotal, deliveryFee, now),
    );
  }

  // 모든 2개 조합 생성
  const pairs: [Coupon, Coupon][] = [];
  for (let i = 0; i < coupons.length; i++) {
    for (let j = i + 1; j < coupons.length; j++) {
      pairs.push([coupons[i], coupons[j]]);
    }
  }

  // 정액 먼저 규칙을 적용한 조합 할인 금액 기준으로 최적 조합 선택
  const bestPair = pairs.reduce((best, current) => {
    const bestDiscount = calculateCombinedDiscount(
      best,
      cartItems,
      orderTotal,
      deliveryFee,
      now,
    );
    const currentDiscount = calculateCombinedDiscount(
      current,
      cartItems,
      orderTotal,
      deliveryFee,
      now,
    );
    return currentDiscount > bestDiscount ? current : best;
  });

  // 개별 할인 금액 기준으로 정렬해서 반환
  return [...bestPair].sort(
    (a, b) =>
      calculateDiscountAmount(b, cartItems, orderTotal, deliveryFee, now) -
      calculateDiscountAmount(a, cartItems, orderTotal, deliveryFee, now),
  );
};
