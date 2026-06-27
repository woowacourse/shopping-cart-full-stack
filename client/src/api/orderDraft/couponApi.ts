import { createApiUrl, request } from '../helper';
import type {
  CouponResponse,
  PreviewRequest,
  PreviewResponse,
} from './couponApi.types';

export const getCoupons = async (orderId: string): Promise<CouponResponse> => {
  const response = await request(createApiUrl(`/orders/${orderId}/coupons`));

  return response.json();
};

export const getDiscountPreviewApi = async (
  orderId: string,
  requestBody: PreviewRequest,
): Promise<PreviewResponse> => {
  const response = await request(
    createApiUrl(`/orders/${orderId}/discount-price`),
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    },
  );

  return response.json();
};
