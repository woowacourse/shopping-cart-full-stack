import {useCallback, useEffect, useState} from 'react';

import {ApiError} from '../../../shared/api/requestApi.js';
import {getCoupons} from '../api/couponApi.js';
import type {Coupon, CouponId} from '../domain/types.js';

type CouponsStatus = 'loading' | 'success' | 'error';
export type CouponsErrorType = 'default' | 'expired' | 'notFound';

export type CouponsError = {
  message: string;
  type: CouponsErrorType;
};

export function useCoupons(preorderId: string | undefined, isRemoteArea: boolean) {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [recommendedCouponIds, setRecommendedCouponIds] = useState<CouponId[]>([]);

  const [status, setStatus] = useState<CouponsStatus>('loading');
  const [error, setError] = useState<CouponsError | null>(null);

  const loadCoupons = useCallback(async () => {
    if (!preorderId) {
      setStatus('error');
      setError({
        message: '쿠폰 정보를 불러올 수 없습니다.',
        type: 'notFound',
      });
      setCoupons([]);
      setRecommendedCouponIds([]);
      return;
    }

    setStatus('loading');
    setError(null);

    try {
      const couponList = await getCoupons(preorderId, isRemoteArea);

      setCoupons(couponList.coupons);
      setRecommendedCouponIds(couponList.recommendedCouponIds ?? []);
      setStatus('success');
    } catch (requestError) {
      setError({
        message: getErrorMessage(requestError),
        type: getCouponsErrorType(requestError),
      });
      setCoupons([]);
      setRecommendedCouponIds([]);
      setStatus('error');
    }
  }, [preorderId, isRemoteArea]);

  useEffect(() => {
    void loadCoupons();
  }, [loadCoupons]);

  return {
    coupons,
    recommendedCouponIds,
    status,
    error,
    loadCoupons,
  };
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;

  return '쿠폰 정보를 불러오지 못했습니다.';
}

function getCouponsErrorType(error: unknown): CouponsErrorType {
  if (!(error instanceof ApiError)) return 'default';
  if (error.status === 410) return 'expired';
  if (error.status === 404) return 'notFound';

  return 'default';
}
