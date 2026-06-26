import { API_BASE_URL } from './config';

export type CouponCode = 'FIXED5000' | 'BOGO' | 'FREESHIPPING' | 'MIRACLESALE';

export interface CouponConditions {
  minimumOrderAmount?: number;
  availableTimeRange?: {
    startsAt: string;
    endsAt: string;
  };
}

export interface Coupon {
  id: string;
  code: CouponCode;
  name: string;
  expiresAt: string;
  conditions?: CouponConditions;
}

export interface CouponListResponse {
  maxCouponCount: number;
  coupons: Coupon[];
}

export const getCoupons = async (): Promise<CouponListResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/coupons/`);

  if (!response.ok) {
    throw new Error('쿠폰 정보를 불러오지 못했습니다.');
  }

  return response.json();
};
