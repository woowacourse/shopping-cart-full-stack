export type CouponType = 'FIXED5000' | 'BOGO' | 'FREESHIPPING' | 'MIRACLESALE';

export interface Coupon {
  id: number;
  name: string;
  type: CouponType;
  expirationDate: string;
}

export interface OrderPreviewRequest {
  mode: 'auto' | 'manual';
  selectedItemIds: number[];
  coupons?: number[];
  isRemoteArea: boolean;
}

export interface CouponStatus {
  id: number;
  applicable: boolean;
}

export interface OrderPreviewResponse {
  orderAmount: number;
  couponDiscount: number;
  deliveryFee: number;
  originalDeliveryFee: number;
  totalPrice: number;
  appliedCoupons: number[];
  couponStatuses: CouponStatus[];
}
