export interface PreviewOrderRequestBody {
  preorderId: string;
  isRemoteArea: boolean;
  couponIds: number[];
}

export interface CreateOrderRequestBody {
  preorderId: string;
  expectedTotalPaymentAmount: number;
}

export interface OrderIdParams {
  orderId: string;
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

export interface CreateOrderResponse {
  orderId: string;
}

export interface OrderSummaryResponse {
  itemCount: number;
  totalQuantity: number;
  totalAmount: number;
}
