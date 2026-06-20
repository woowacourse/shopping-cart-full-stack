export interface PreviewOrderRequestBody {
  preorderId: string;
  isRemoteArea: boolean;
  couponIds: number[];
}

export interface ExcludedCoupon {
  couponId: number;
  code: string;
  name: string;
  excludedReason: string;
}

export interface AppliedCoupon {
  couponId: number;
  code: string;
  name: string;
  discountAmount: number;
}

export interface OrderPrice {
  orderAmount: number;
  productDiscountAmount: number;
  shippingDiscountAmount: number;
  totalDiscountAmount: number;
  shippingFee: number;
  totalPaymentAmount: number;
}

export interface PreviewOrderResponse {
  price: OrderPrice;
  appliedCoupons: AppliedCoupon[];
  excludedCoupons: ExcludedCoupon[];
}
