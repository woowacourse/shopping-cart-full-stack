import { formatPrice } from "../../shared/utils";
import type {
  CheckoutContent,
  CheckoutCoupon,
  CheckoutItem,
} from "./checkout.api";
import { BOGO_MIN_ITEM_COUNT } from "./checkout.constant";

export const getCheckoutAllItemCount = (filteredCartItem: CheckoutItem[]) => {
  return filteredCartItem.reduce((acc, item) => acc + item.itemCount, 0);
};

export const formatExpiryDate = (expiryDate: string) => {
  const [year, month, date] = expiryDate.split("-");
  return `${year}년 ${month}월 ${date}일`;
};

export const formatCouponUsageConditions = ({
  minAmount,
  startTime,
  endTime,
}: Pick<CheckoutCoupon, "minAmount" | "startTime" | "endTime">) => {
  const formattedConditions = [];
  if (minAmount) {
    formattedConditions.push(`최소 주문 금액: ${formatPrice(minAmount)}원`);
  }
  if (startTime && endTime) {
    formattedConditions.push(`사용 가능 시간: ${startTime}부터 ${endTime}까지`);
  }

  return formattedConditions;
};

export const getFilteredCoupon = (
  coupons: CheckoutCoupon[],
  selectedCouponIds: number[],
) => {
  return coupons.filter((coupon) => selectedCouponIds.includes(coupon.id));
};

export const getTotalCouponDiscountPrice = ({
  selectedCoupons,
  checkoutItems,
  orderPrice,
  deliveryFee,
}: { selectedCoupons: CheckoutCoupon[] } & Pick<
  CheckoutContent,
  "checkoutItems" | "orderPrice" | "deliveryFee"
>) => {
  const sortedCoupons = selectedCoupons.toSorted((a, b) => {
    const aIsRateDiscountCoupon = isRateDiscountCoupon(a);
    const bIsRateDiscountCoupon = isRateDiscountCoupon(b);

    if (aIsRateDiscountCoupon === bIsRateDiscountCoupon) {
      return 0;
    }

    return aIsRateDiscountCoupon ? 1 : -1;
  });

  let targetPrice = orderPrice;
  let totalDiscountPrice = 0;

  sortedCoupons.forEach((coupon) => {
    const discountPrice = getDiscountAmount({
      coupon,
      checkoutItems,
      targetPrice,
      deliveryFee,
    });
    targetPrice -= discountPrice;
    totalDiscountPrice += discountPrice;
  });

  return totalDiscountPrice;
};

const isRateDiscountCoupon = ({
  fixedDiscountRate,
}: Pick<CheckoutCoupon, "fixedDiscountRate">) => {
  return fixedDiscountRate !== null;
};

const getDiscountAmount = ({
  coupon,
  checkoutItems,
  targetPrice,
  deliveryFee,
}: {
  coupon: CheckoutCoupon;
  targetPrice: CheckoutContent["orderPrice"];
} & Pick<CheckoutContent, "checkoutItems" | "deliveryFee">) => {
  if (coupon.type.includes("FIXED")) {
    if (coupon.fixedDiscountPrice === null) {
      console.error("서버에서 올바른 할인금액이 설정되지 않았습니다.");
      return 0;
    }
    return coupon.fixedDiscountPrice;
  }

  if (coupon.type.includes("BOGO")) {
    const filteredPrice = checkoutItems
      .filter((item) => item.itemCount >= BOGO_MIN_ITEM_COUNT)
      .map((item) => item.price);

    if (filteredPrice.length === 0) {
      return 0;
    }

    return Math.max(...filteredPrice);
  }

  if (coupon.type.includes("FREESHIPPING")) {
    return deliveryFee;
  }

  if (coupon.type.includes("MIRACLESALE")) {
    if (coupon.fixedDiscountRate === null) {
      console.error("서버에서 올바른 할인 비율이 설정되지 않았습니다.");

      return 0;
    }

    return targetPrice * (coupon.fixedDiscountRate / 100);
  }

  return 0;
};
