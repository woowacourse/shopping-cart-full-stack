import { CART_ERROR_RESPONSE, COUPON_ERROR_RESPONSE } from "../constants/error.js";
import { calculateTotalCouponDiscount } from "../domain/coupon/coupon.discount.js";
import { getShippingFee } from "../domain/shipping/shipping.price.js";
import { getCartItems } from "./cart.service.js";
import { createCouponResponses, getCouponsByIds } from "./coupon.service.js";

export async function fetchOrderItems(selectedCartItemIds: number[]) {
  const cartItems = await getCartItems();
  const selectedItems = cartItems.filter((item) => selectedCartItemIds.includes(item.id));

  if (selectedItems.length !== selectedCartItemIds.length)
    throw new Error(CART_ERROR_RESPONSE.CART_ITEM_NOT_FOUND.code);

  return selectedItems;
}

export async function fetchOrderSummary(
  selectedCartItemIds: number[],
  selectedCouponIds: number[],
  isRemoteArea: boolean,
) {
  // 선택된 상품, 주문 금액
  const selectedItems = await fetchOrderItems(selectedCartItemIds);
  const orderAmount = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // 선택된 쿠폰, 쿠폰 할인 금액
  const selectedCoupons = getCouponsByIds(selectedCouponIds);
  const couponResponses = createCouponResponses(selectedCoupons, selectedItems, isRemoteArea);
  const hasNotUsableCoupon = couponResponses.some((coupon) => !coupon.isUsable);
  if (hasNotUsableCoupon) throw new Error(COUPON_ERROR_RESPONSE.COUPON_NOT_APPLICABLE.code);
  const couponDiscountAmount = calculateTotalCouponDiscount(couponResponses, orderAmount);

  // 배송비
  const shippingFee = getShippingFee(isRemoteArea, orderAmount);

  // 총 결제 금액
  const totalPaymentAmount = orderAmount + shippingFee - couponDiscountAmount;

  return {
    orderItems: selectedItems,
    orderAmount,
    couponDiscountAmount,
    shippingFee,
    totalPaymentAmount,
  };
}
