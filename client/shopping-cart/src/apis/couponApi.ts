import type { CouponInfo } from '../types';
import { BASE_URL } from './client';

type GetCouponsResponse = {
  status: 200;
  data: CouponInfo;
};

type CalculateCouponDiscountResponse = {
  status: 200;
  data: { discountAmount: number };
};

export const getCoupons = async (): Promise<CouponInfo> => {
  const response = await fetch(`${BASE_URL}/order-check/coupons`);

  if (!response.ok) {
    throw new Error('쿠폰 정보 조회에 실패했습니다.');
  }

  const result: GetCouponsResponse = await response.json();
  return result.data;
};

export const calculateCouponDiscount = async (selectedCouponId: string[]): Promise<number> => {
  const response = await fetch(`${BASE_URL}/order-check/coupons`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ selectedCouponId }),
  });

  if (!response.ok) {
    throw new Error('쿠폰 할인액 계산에 실패했습니다.');
  }

  const result: CalculateCouponDiscountResponse = await response.json();
  return result.data.discountAmount;
};

export const applyCoupons = async (selectedCouponId: string[]): Promise<void> => {
  const response = await fetch(`${BASE_URL}/order-check/coupons`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ selectedCouponId }),
  });

  if (!response.ok) {
    throw new Error('쿠폰 적용에 실패했습니다.');
  }
};
