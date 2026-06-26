import type {CouponId} from '../../coupon/domain/types.js';
import {requestApi} from '../../../shared/api/requestApi.js';
import type {PreviewOrder} from '../domain/types.js';

const ORDER_PREVIEW_API_ERROR_MESSAGE = '결제 금액 미리보기 요청에 실패했습니다.';

export interface PreviewOrderRequestBody {
  preorderId: string;
  isRemoteArea: boolean;
  couponIds: CouponId[];
}

export async function previewOrder(body: PreviewOrderRequestBody): Promise<PreviewOrder> {
  return requestApi<PreviewOrder>('/order/preview', {
    errorMessage: ORDER_PREVIEW_API_ERROR_MESSAGE,
    method: 'POST',
    body: JSON.stringify(body),
  });
}
