export interface CouponRequestDto {
  selectedCartItemIds: number[];
  isRemoteArea: boolean;
}

export interface CouponResponse {
  id: number;
  name: string;
  description: string[];
  discountType: "FIXED" | "RATE" | "SHIPPING";
  isUsable: boolean;
  discountValue: number;
}

export interface CouponResponseDto {
  bestCombination: number[];
  totalPrice: number;
  couponResponses: CouponResponse[];
}
