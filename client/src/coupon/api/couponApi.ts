import {requestApi} from '../../shared/api/requestApi.js';
import type {CouponList} from '../domain/types.js';

const COUPON_API_ERROR_MESSAGE = '쿠폰 요청에 실패했습니다.';

export async function getCoupons(preorderId: string, isRemoteArea: boolean): Promise<CouponList> {
  const query = new URLSearchParams({
    preorderId,
    isRemoteArea: String(isRemoteArea),
  });

  return requestApi<CouponList>(`/coupons?${query.toString()}`, {
    errorMessage: COUPON_API_ERROR_MESSAGE,
  });
}
