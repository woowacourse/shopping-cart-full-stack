import type { Product } from './cart';
import type { CouponCode } from './coupon';
import { API_BASE_URL } from './config';

export interface OrderSheetRequestItem {
  productId: string;
  quantity: number;
}

export interface OrderSheet {
  id: string;
  items: Array<{
    product: Product;
    quantity: number;
  }>;
  selectedCouponIds: string[];
  isRemoteShippingArea: boolean;
}

export interface OrderSheetPricing {
  orderAmount: number;
  shippingFee: number;
  discountAmount: number;
  totalPaymentAmount: number;
}

export interface AvailableCouponListResponse {
  coupons: Array<{
    id: string;
    code: CouponCode;
  }>;
}

interface CouponDiscountPreviewResponse {
  discountAmount: number;
}

interface CreateOrderSheetResponse {
  id: string;
}

export const createOrderSheet = async (
  items: OrderSheetRequestItem[],
): Promise<CreateOrderSheetResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/order-sheets/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ items }),
  });

  if (!response.ok) {
    throw new Error('주문 정보를 준비하지 못했습니다. 다시 시도해 주세요.');
  }

  return response.json();
};

export const getOrderSheet = async (
  orderSheetId: string,
): Promise<OrderSheet> => {
  const response = await fetch(
    `${API_BASE_URL}/api/order-sheets/${orderSheetId}/`,
  );

  if (!response.ok) {
    throw new Error('주문 정보를 불러오지 못했습니다.');
  }

  const data = await response.json();

  return data.orderSheet;
};

export const getOrderSheetPricing = async (
  orderSheetId: string,
): Promise<OrderSheetPricing> => {
  const response = await fetch(
    `${API_BASE_URL}/api/order-sheets/${orderSheetId}/pricing/`,
  );

  if (!response.ok) {
    throw new Error('결제 금액을 불러오지 못했습니다.');
  }

  const data = await response.json();

  return data.pricing;
};

export const getAvailableCoupons = async (
  orderSheetId: string,
): Promise<AvailableCouponListResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/api/order-sheets/${orderSheetId}/coupons/`,
  );

  if (!response.ok) {
    throw new Error('사용 가능한 쿠폰 정보를 불러오지 못했습니다.');
  }

  return response.json();
};

export const requestCouponDiscountPreview = async (
  orderSheetId: string,
  selectedCouponIds: string[],
): Promise<CouponDiscountPreviewResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/api/order-sheets/${orderSheetId}/discount-preview/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ selectedCouponIds }),
    },
  );

  if (!response.ok) {
    throw new Error('쿠폰 할인 금액을 계산하지 못했습니다.');
  }

  return response.json();
};

export const updateOrderSheetCoupons = async (
  orderSheetId: string,
  selectedCouponIds: string[],
): Promise<void> => {
  const response = await fetch(
    `${API_BASE_URL}/api/order-sheets/${orderSheetId}/coupons/`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ selectedCouponIds }),
    },
  );

  if (!response.ok) {
    throw new Error('쿠폰을 적용하지 못했습니다.');
  }
};

export const updateShippingArea = async (
  orderSheetId: string,
  isRemoteShippingArea: boolean,
): Promise<void> => {
  const response = await fetch(
    `${API_BASE_URL}/api/order-sheets/${orderSheetId}/shipping-area/`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isRemoteShippingArea }),
    },
  );

  if (!response.ok) {
    throw new Error('배송 정보를 변경하지 못했습니다.');
  }
};
