import type {
  Coupon,
  OrderPreviewRequest,
  OrderPreviewResponse,
} from '../types/couponType';

const BASE_URL = 'https://shopping-cart-full-stack-production-9304.up.railway.app';

export const getCoupons = async (): Promise<Coupon[]> => {
  const response = await fetch(`${BASE_URL}/coupons`);
  if (!response.ok) throw new Error('쿠폰 목록을 불러오지 못했습니다.');
  return response.json();
};

export const getOrderPreview = async (
  request: OrderPreviewRequest,
): Promise<OrderPreviewResponse> => {
  const response = await fetch(`${BASE_URL}/order/preview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!response.ok) throw new Error('주문 금액을 계산하지 못했습니다.');
  return response.json();
};
