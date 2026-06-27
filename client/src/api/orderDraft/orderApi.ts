import { createApiUrl, request } from '../helper';
import type {
  GetDiscountPriceRequest,
  OrderResponse,
  PatchOrderRequest,
  PatchOrderResponse,
  PostOrderRequest,
  PostOrderResponse,
} from './orderApi.types';

// 1. 주문 정보 조회
export const getOrder = async (orderId: string): Promise<OrderResponse> => {
  const response = await request(createApiUrl(`/orders/${orderId}`));

  return response.json();
};

// 2. 주문 정보 등록
export const postOrder = async (
  requestBody: PostOrderRequest,
): Promise<PostOrderResponse> => {
  const response = await request(createApiUrl(`/orders`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  return response.json();
};

// 3. 주문 정보 수정 - 쿠폰ID
export const patchOrderCouponIds = async (
  orderId: string,
  requestBody: Pick<PatchOrderRequest, 'couponIds'>,
): Promise<PatchOrderResponse> => {
  const response = await request(createApiUrl(`/orders/${orderId}/coupons`), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  return response.json();
};

// 4. 주문 정보 수정 - 도서산간
export const patchOrderIsIsland = async (
  orderId: string,
  requestBody: Pick<PatchOrderRequest, 'isIsland'>,
): Promise<PatchOrderResponse> => {
  const response = await request(
    createApiUrl(`/orders/${orderId}/delivery-area`),
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    },
  );

  return response.json();
};

// 5. 할인 금액 조회
export const getDiscountPrice = async (
  orderId: string,
  requestBody: GetDiscountPriceRequest,
) => {
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
