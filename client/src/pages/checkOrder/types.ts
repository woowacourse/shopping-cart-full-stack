export type CouponType = "FIXED5000" | "BOGO" | "FREESHIPPING" | "MIRACLESALE";

export interface Coupon {
  id: number;
  name: string;
  type: CouponType;
  expiryDate: string;
  minAmount: number | null;
  startTime: string | null;
  endTime: string | null;
}

/** 서버가 계산해 내려주는 금액 정보. 프론트는 이 값을 그대로 표시만 한다(SSOT). */
export interface OrderCalculation {
  orderAmount: number;
  discountAmount: number;
  shippingFee: number;
  totalPayment: number;
  totalDiscount: number;
  availableCouponIds: number[];
  recommendedCouponIds: number[];
}

/** 금액 계산 요청에 필요한 최소 상품 정보 */
export interface CalculationItem {
  price: number;
  quantity: number;
}
