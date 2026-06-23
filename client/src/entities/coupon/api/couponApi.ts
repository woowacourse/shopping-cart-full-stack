import { API_BASE_URL } from '../../../shared/config/env';
import type { Coupon, CouponCode, CouponDiscount } from '../types';

export async function fetchOrderCoupons(orderId: string): Promise<Coupon[]> {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/coupons`);

  if (!response.ok) {
    throw new Error('쿠폰 목록을 불러오지 못했습니다.');
  }

  return response.json();
}

export async function calculateCouponDiscount(
  orderId: string,
  coupons: CouponCode[],
): Promise<CouponDiscount> {
  const response = await fetch(
    `${API_BASE_URL}/orders/${orderId}/coupons/discount`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ coupons }),
    },
  );

  if (!response.ok) {
    throw new Error('쿠폰 할인 금액을 계산하지 못했습니다.');
  }

  return response.json();
}

export async function updateOrderCoupons(
  orderId: string,
  coupons: CouponCode[],
) {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/coupons`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ coupons }),
  });

  if (!response.ok) {
    throw new Error('쿠폰을 적용하지 못했습니다.');
  }
}
