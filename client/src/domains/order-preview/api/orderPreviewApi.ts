import type {CouponId} from '../../coupon/domain/types.js';
import {requestApi} from '../../../shared/api/requestApi.js';

const ORDER_PREVIEW_API_ERROR_MESSAGE = '결제 금액 미리보기 요청에 실패했습니다.';

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

export interface BenefitItem {
  productId: string;
  quantity: number;
}

export interface PreviewOrderResponse {
  price: OrderPrice;
  appliedCoupons: AppliedCoupon[];
  excludedCoupons: ExcludedCoupon[];
  benefitItems: BenefitItem[];
}

export async function previewOrder(body: PreviewOrderRequestBody): Promise<PreviewOrderResponse> {
  return requestApi<PreviewOrderResponse>('/order/preview', {
    errorMessage: ORDER_PREVIEW_API_ERROR_MESSAGE,
    method: 'POST',
    body: JSON.stringify(body),
  });
}
