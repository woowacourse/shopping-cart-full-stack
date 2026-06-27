import type { CartItem } from "./cart.api.dto";

export interface OrderSummaryRequestDto {
  selectedCartItemIds: number[];
  selectedCouponIds: number[];
  isRemoteArea: boolean;
}

export interface OrderSummaryResponseDto {
  orderItems: CartItem[];
  orderAmount: number;
  couponDiscountAmount: number;
  shippingFee: number;
  totalPaymentAmount: number;
}
