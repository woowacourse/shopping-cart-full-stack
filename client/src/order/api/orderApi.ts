import type {CartItemId} from '../../cart/domain/types.js';
import type {CouponId} from '../../coupon/domain/types.js';
import {requestApi} from '../../shared/api/requestApi.js';

const ORDER_API_ERROR_MESSAGE = '주문 요청에 실패했습니다.';

type CreatePreorderResponse = {
  preorderId: string;
};

export type PreorderItem = {
  productId: string;
  price: number;
  name: string;
  imageUrl: string;
  quantity: number;
};

export type Preorder = {
  preorderId: string;
  items: PreorderItem[];
};

export interface PreviewOrderRequestBody {
  preorderId: string;
  isRemoteArea: boolean;
  couponIds: CouponId[];
}

export interface AppliedCoupon {
  couponId: CouponId;
  code: string;
  name: string;
  discountAmount: number;
}

export interface ExcludedCoupon {
  couponId: CouponId;
  code: string;
  name: string;
  excludedReason: string;
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

export async function createPreorder(selectedCartIds: CartItemId[]): Promise<CreatePreorderResponse> {
  return requestApi<CreatePreorderResponse>('/preorder', {
    errorMessage: ORDER_API_ERROR_MESSAGE,
    method: 'POST',
    body: JSON.stringify({selectedCartIds}),
  });
}

export async function getPreorder(preorderId: string): Promise<Preorder> {
  return requestApi<Preorder>(`/preorder/${encodeURIComponent(preorderId)}`, {
    errorMessage: ORDER_API_ERROR_MESSAGE,
  });
}

export async function previewOrder(body: PreviewOrderRequestBody): Promise<PreviewOrderResponse> {
  return requestApi<PreviewOrderResponse>('/order/preview', {
    errorMessage: ORDER_API_ERROR_MESSAGE,
    method: 'POST',
    body: JSON.stringify(body),
  });
}
