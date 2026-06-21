import {useCallback, useEffect, useState} from 'react';

import {ApiError} from '../../../shared/api/requestApi.js';
import {getCoupons} from '../api/couponApi.js';
import type {Coupon, CouponId} from '../domain/types.js';

type CouponsStatus = 'loading' | 'success' | 'error';
export type CouponsErrorType = 'default' | 'expired' | 'notFound';

export function useCoupons(preorderId: string | undefined, isRemoteArea: boolean) {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [recommendedCouponIds, setRecommendedCouponIds] = useState<CouponId[]>([]);

  const [status, setStatus] = useState<CouponsStatus>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorType, setErrorType] = useState<CouponsErrorType>('default');

  const loadCoupons = useCallback(async () => {
    if (!preorderId) {
      setStatus('error');
      setErrorMessage('쿠폰 정보를 불러올 수 없습니다.');
      setErrorType('notFound');
      setCoupons([]);
      setRecommendedCouponIds([]);
      return;
    }

    setStatus('loading');
    setErrorMessage('');
    setErrorType('default');

    try {
      const couponList = await getCoupons(preorderId, isRemoteArea);

      setCoupons(couponList.coupons);
      setRecommendedCouponIds(couponList.recommendedCouponIds ?? []);
      setStatus('success');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setErrorType(getCouponsErrorType(error));
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
    errorMessage,
    errorType,
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
