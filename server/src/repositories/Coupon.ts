export interface Coupon {
  couponId: number;
  couponCode: string; // 'FIXED5000' | 'BOGO' | 'FREESHIPPING' | 'MIRACLESALE'
  expiredDate: string;
  minOrderAmount?: number;
  usableStartAt?: string | null;
  usableEndAt?: string | null;
  discountAmount?: number;
  discountRate?: number;
}
