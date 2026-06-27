import { useEffect, useState } from 'react';

import { useQuery } from '../../../shared/hooks/useQuery';
import type {
  CouponResponse,
  PreviewRequest,
  PreviewResponse,
} from '../../../api/orderDraft/couponApi.types';
import {
  getCoupons,
  getDiscountPreviewApi,
} from '../../../api/orderDraft/couponApi';
import { useMutation } from '../../../shared/hooks/useMutation';
import { patchOrderCouponIds } from '../../../api/orderDraft/orderApi';
import type {
  PatchOrderRequest,
  PatchOrderResponse,
} from '../../../api/orderDraft/orderApi.types';

export const useCoupons = (orderId: string, appliedCouponIds: string[]) => {
  // 선택된 쿠폰 상태
  const [selectedCouponIds, setSelectedCouponIds] =
    useState<string[]>(appliedCouponIds);

  // preview 상태
  const [preview, setPreview] = useState<PreviewResponse | null>(null);

  // 쿠폰 목록
  const { data, isLoading, error } = useQuery<CouponResponse>(
    `coupons-${orderId ?? 'idle'}`,
    getCoupons,
    orderId,
  );

  // 할인 금액 mutation
  const {
    mutate: getDiscountPreviewMutate,
    isLoading: isPreviewLoading,
    error: getPreviewError,
  } = useMutation<PreviewRequest, PreviewResponse>(({ couponIds }) =>
    getDiscountPreviewApi(orderId, { couponIds }),
  );

  // 쿠폰 적용 mutation
  const {
    mutate: applyCouponsMutate,
    isLoading: isApplying,
    error: applyError,
  } = useMutation<Pick<PatchOrderRequest, 'couponIds'>, PatchOrderResponse>(
    ({ couponIds }) => patchOrderCouponIds(orderId, { couponIds }),
  );

  // 쿠폰 적용
  const applySelectedCoupons = async () => {
    const result = await applyCouponsMutate({
      couponIds: selectedCouponIds,
    });

    if (!result) return false;

    return true;
  };

  // 쿠폰 선택 변경
  const toggleCoupon = async (couponId: string) => {
    const nextCouponIds = selectedCouponIds.includes(couponId)
      ? selectedCouponIds.filter((id) => id !== couponId)
      : [...selectedCouponIds, couponId];

    if (nextCouponIds.length > 2) return;

    const result = await getDiscountPreviewMutate({
      couponIds: nextCouponIds,
    });

    if (!result) return;

    setSelectedCouponIds(nextCouponIds);
    setPreview(result);
  };

  // useEffect로 할인 금액 초기화
  useEffect(() => {
    const loadInitialPreview = async () => {
      const result = await getDiscountPreviewMutate({
        couponIds: appliedCouponIds,
      });

      if (result) {
        setPreview(result);
      }
    };

    loadInitialPreview();
  }, []);

  return {
    selectedCouponIds,

    data,
    isLoading,
    error,

    preview,
    toggleCoupon,
    isPreviewLoading,

    applySelectedCoupons,
    isApplying,

    couponActionError: getPreviewError || applyError,
  };
};
