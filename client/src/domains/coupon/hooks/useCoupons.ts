import {useCallback, useEffect, useState} from 'react';

import {getCoupons} from '../api/couponApi.js';
import type {Coupon, CouponId} from '../domain/types.js';

type CouponsStatus = 'loading' | 'success' | 'error';

export function useCoupons(preorderId: string | undefined, isRemoteArea: boolean) {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [recommendedCouponIds, setRecommendedCouponIds] = useState<CouponId[]>([]);
  const [status, setStatus] = useState<CouponsStatus>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  const loadCoupons = useCallback(async () => {
    if (!preorderId) {
      setStatus('error');
      setErrorMessage('쿠폰 정보를 불러올 수 없습니다.');
      setCoupons([]);
      setRecommendedCouponIds([]);
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const couponList = await getCoupons(preorderId, isRemoteArea);

      setCoupons(couponList.coupons);
      setRecommendedCouponIds(couponList.recommendedCouponIds ?? []);
      setStatus('success');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
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
    loadCoupons,
  };
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;

  return '쿠폰 정보를 불러오지 못했습니다.';
}
