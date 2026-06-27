export const BASE_DELIVERY_PRICE = 3000;
export const HARD_DELIVERY_PRICE = 3000;
export const FREE_DELIVERY_THRESHOLD = 100000;

export interface CheckoutProps {
  checkedProductIds: string[];
  hardDeliveryPlace: boolean;
  selectedCouponIds: string[];
}
