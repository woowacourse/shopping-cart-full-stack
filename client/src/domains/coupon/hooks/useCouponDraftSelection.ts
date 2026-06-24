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
  const [hasInitializedDraft, setHasInitializedDraft] = useState(false);

  const openCouponModal = () => {
    if (!hasInitializedDraft && draftCouponIds.length === 0 && appliedCouponIds.length > 0) {
      setDraftCouponIds(appliedCouponIds);
      setHasInitializedDraft(true);
    }

    if (!hasInitializedDraft && draftCouponIds.length === 0 && appliedCouponIds.length === 0 && canUseRecommendedCoupons) {
      setDraftCouponIds(recommendedCouponIds.filter((couponId) => selectableCouponIds.includes(couponId)));
      setHasInitializedDraft(true);
    }

    setIsCouponModalOpen(true);
  };

  const closeCouponModal = () => {
    setIsCouponModalOpen(false);
  };

  const applyDraftCouponIds = () => {
    setAppliedCouponIds(draftCouponIds);
    setHasInitializedDraft(true);
    setIsCouponModalOpen(false);
  };

  const changeDraftCouponIds = (couponIds: CouponId[]) => {
    setDraftCouponIds(couponIds);
    setHasInitializedDraft(true);
  };

  useEffect(() => {
    if (!isCouponModalOpen) return;
    if (hasInitializedDraft) return;
    if (draftCouponIds.length > 0) return;
    if (!canUseRecommendedCoupons) return;

    setDraftCouponIds(recommendedCouponIds.filter((couponId) => selectableCouponIds.includes(couponId)));
    setHasInitializedDraft(true);
  }, [
    canUseRecommendedCoupons,
    draftCouponIds.length,
    hasInitializedDraft,
    isCouponModalOpen,
    recommendedCouponIds,
    selectableCouponIds,
  ]);

  useEffect(() => {
    if (!isCouponModalOpen) return;
    if (!canUseRecommendedCoupons) return;

    setDraftCouponIds((couponIds) => {
      const syncedCouponIds = couponIds.filter((couponId) => selectableCouponIds.includes(couponId));

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
