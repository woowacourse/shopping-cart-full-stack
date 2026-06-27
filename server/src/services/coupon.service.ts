import { CART_ERROR_RESPONSE, COUPON_ERROR_RESPONSE } from "../constants/error.js";
import { createCouponCombinations, findBestCombination } from "../domain/coupon/coupon.combination.js";
import {
  calculateCouponDiscountValue,
  calculateTotalCouponDiscount,
  getDiscountType,
} from "../domain/coupon/coupon.discount.js";
import { isCouponUsable } from "../domain/coupon/coupon.usability.js";
import { CartItemResponse } from "../interfaces/cart.interface.js";
import { CouponEntity } from "../interfaces/coupon.interface.js";
import { findAll, findById } from "../repositories/coupon.repository.js";
import { getCartItems } from "./cart.service.js";

export async function getCoupons(selectedCartItemIds: number[], isRemoteArea: boolean) {
  // 선택된 상품, 주문 금액
  const cartItems = await getCartItems();
  const selectedItems = cartItems.filter((item) => selectedCartItemIds.includes(item.id));
  if (selectedItems.length !== selectedCartItemIds.length)
    throw new Error(CART_ERROR_RESPONSE.CART_ITEM_NOT_FOUND.code);
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // 쿠폰 불러오기, 쿠폰 사용 여부
  const coupons = await findAll();
  const couponResponses = createCouponResponses(coupons, selectedItems, isRemoteArea);
  const usableCoupons = couponResponses.filter((coupon) => coupon.isUsable);

  // 사용 가능 쿠폰 중 조합 생성 (최대 2개)
  const couponCombination = createCouponCombinations(usableCoupons);
  const combinationResults = couponCombination.map((combination) => ({
    couponIds: combination.map((coupon) => coupon.id),
    discountAmount: calculateTotalCouponDiscount(combination, totalPrice),
  }));

  // 가장 높은 할인률 쿠폰 조합
  const bestCombination = findBestCombination(combinationResults);

  return {
    bestCombination,
    totalPrice,
    couponResponses,
  };
}

export function getCouponsByIds(couponIds: number[]) {
  return couponIds.map((id) => {
    const coupon = findById(id);

    if (coupon === null) {
      throw new Error(COUPON_ERROR_RESPONSE.COUPON_NOT_FOUND.code);
    }

    return coupon;
  });
}

export function createCouponResponses(
  coupons: CouponEntity[],
  selectedItems: CartItemResponse[],
  isRemoteArea: boolean,
) {
  return coupons.map((coupon) => {
    const usable = isCouponUsable(coupon, selectedItems);

    return {
      id: coupon.id,
      name: coupon.name,
      description: coupon.description,
      discountType: getDiscountType(coupon),
      isUsable: usable,
      discountValue: usable ? calculateCouponDiscountValue(coupon, selectedItems, isRemoteArea) : 0,
    };
  });
}
