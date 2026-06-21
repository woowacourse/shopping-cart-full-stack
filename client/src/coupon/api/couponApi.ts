import {requestApi} from '../../shared/api/requestApi.js';
import type {Coupon} from '../domain/types.js';

const COUPON_API_ERROR_MESSAGE = '쿠폰 요청에 실패했습니다.';

type GetCouponsResponse = {
  coupons: Coupon[];
};

export async function getCoupons(preorderId: string): Promise<Coupon[]> {
  const response = await requestApi<GetCouponsResponse>(`/coupons?preorderId=${encodeURIComponent(preorderId)}`, {
    errorMessage: COUPON_API_ERROR_MESSAGE,
  });

  return response.coupons;
}
