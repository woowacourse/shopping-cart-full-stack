import {useEffect, useState} from 'react';

import type {CouponId} from '../domain/types.js';

interface UseCouponDraftSelectionParams {
  canUseRecommendedCoupons: boolean;
  recommendedCouponIds: CouponId[];
  selectableCouponIds: CouponId[];
}

export function useCouponDraftSelection({
  canUseRecommendedCoupons,
  recommendedCouponIds,
  selectableCouponIds,
}: UseCouponDraftSelectionParams) {
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [appliedCouponIds, setAppliedCouponIds] = useState<CouponId[]>([]);
  const [draftCouponIds, setDraftCouponIds] = useState<CouponId[]>([]);
  const [isDraftInitialized, setIsDraftInitialized] = useState(false);

  const openCouponModal = () => {
    if (!isDraftInitialized && draftCouponIds.length === 0) {
      const initialDraftCouponIds = getInitialDraftCouponIds({
        appliedCouponIds,
        canUseRecommendedCoupons,
        recommendedCouponIds,
        selectableCouponIds,
      });

      if (appliedCouponIds.length > 0 || canUseRecommendedCoupons) {
        setDraftCouponIds(initialDraftCouponIds);
        setIsDraftInitialized(true);
      }
    }

    setIsCouponModalOpen(true);
  };

  const closeCouponModal = () => {
    setIsCouponModalOpen(false);
  };

  const applyDraftCouponIds = () => {
    setAppliedCouponIds(draftCouponIds);
    setIsDraftInitialized(true);
    setIsCouponModalOpen(false);
  };

  const changeDraftCouponIds = (couponIds: CouponId[]) => {
    setDraftCouponIds(couponIds);
    setIsDraftInitialized(true);
  };

  useEffect(() => {
    if (!isCouponModalOpen) return;
    if (isDraftInitialized) return;
    if (draftCouponIds.length > 0) return;
    if (!canUseRecommendedCoupons) return;

    setDraftCouponIds(filterSelectableCouponIds(recommendedCouponIds, selectableCouponIds));
    setIsDraftInitialized(true);
  }, [
    canUseRecommendedCoupons,
    draftCouponIds.length,
    isDraftInitialized,
    isCouponModalOpen,
    recommendedCouponIds,
    selectableCouponIds,
  ]);

  useEffect(() => {
    if (!isCouponModalOpen) return;
    if (!canUseRecommendedCoupons) return;

    setDraftCouponIds((couponIds) => {
      const syncedCouponIds = filterSelectableCouponIds(couponIds, selectableCouponIds);

      if (syncedCouponIds.length === couponIds.length) {
        return couponIds;
      }

      return syncedCouponIds;
    });
  }, [canUseRecommendedCoupons, isCouponModalOpen, selectableCouponIds]);

  return {
    appliedCouponIds,
    draftCouponIds,
    isCouponModalOpen,
    applyDraftCouponIds,
    closeCouponModal,
    openCouponModal,
    setDraftCouponIds: changeDraftCouponIds,
  };
}

interface GetInitialDraftCouponIdsParams {
  appliedCouponIds: CouponId[];
  canUseRecommendedCoupons: boolean;
  recommendedCouponIds: CouponId[];
  selectableCouponIds: CouponId[];
}

function getInitialDraftCouponIds({
  appliedCouponIds,
  canUseRecommendedCoupons,
  recommendedCouponIds,
  selectableCouponIds,
}: GetInitialDraftCouponIdsParams) {
  if (appliedCouponIds.length > 0) return appliedCouponIds;
  if (!canUseRecommendedCoupons) return [];

  return filterSelectableCouponIds(recommendedCouponIds, selectableCouponIds);
}

function filterSelectableCouponIds(couponIds: CouponId[], selectableCouponIds: CouponId[]) {
  const selectableCouponIdSet = new Set(selectableCouponIds);

  return couponIds.filter((couponId) => selectableCouponIdSet.has(couponId));
}
