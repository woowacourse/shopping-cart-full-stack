import type { OrderSummaryRequestDto } from "../apis/order.api.dto";
import type { CouponRequestDto } from "../apis/coupon.api.dto";

const SELECTED_CART_ITEM_IDS_KEY = "selectedCartItemIds";
const SELECTED_COUPON_IDS_KEY = "selectedCouponIds";
const IS_REMOTE_AREA_KEY = "isRemoteArea";

export function getOrderSummaryRequestDto(): OrderSummaryRequestDto {
  return {
    selectedCartItemIds: JSON.parse(
      localStorage.getItem(SELECTED_CART_ITEM_IDS_KEY) ?? "[]",
    ) as number[],
    selectedCouponIds: JSON.parse(
      localStorage.getItem(SELECTED_COUPON_IDS_KEY) ?? "[]",
    ) as number[],
    isRemoteArea: localStorage.getItem(IS_REMOTE_AREA_KEY) === "true",
  };
}

export function getCouponRequestDto(): CouponRequestDto {
  const { selectedCartItemIds, isRemoteArea } = getOrderSummaryRequestDto();

  return {
    selectedCartItemIds,
    isRemoteArea,
  };
}

export function getSelectedCouponIds(): number[] {
  return JSON.parse(
    localStorage.getItem(SELECTED_COUPON_IDS_KEY) ?? "[]",
  ) as number[];
}

export function saveSelectedCouponIds(selectedCouponIds: number[]): void {
  localStorage.setItem(
    SELECTED_COUPON_IDS_KEY,
    JSON.stringify(selectedCouponIds),
  );
}

export function getIsRemoteArea(): boolean {
  return localStorage.getItem(IS_REMOTE_AREA_KEY) === "true";
}

export function setIsRemoteArea(isRemoteArea: boolean): void {
  localStorage.setItem(IS_REMOTE_AREA_KEY, String(isRemoteArea));
}

export function clearOrderStorage(): void {
  localStorage.removeItem(SELECTED_COUPON_IDS_KEY);
  localStorage.removeItem(IS_REMOTE_AREA_KEY);
}

export function clearCartStorage(): void {
  localStorage.removeItem(SELECTED_CART_ITEM_IDS_KEY);
}

export function clearAllOrderStorage(): void {
  clearCartStorage();
  clearOrderStorage();
}
