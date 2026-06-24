import {useEffect, useState} from 'react';

import type {CouponId} from '../domain/types.js';

interface UseCouponDraftSelectionParams {
  canUseRecommendedCoupons: boolean;
  recommendedCouponIds: CouponId[];
}

export function useCouponDraftSelection({
  canUseRecommendedCoupons,
  recommendedCouponIds,
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

    setDraftCouponIds(recommendedCouponIds);
    setHasInitializedDraft(true);
  }, [canUseRecommendedCoupons, draftCouponIds.length, hasInitializedDraft, isCouponModalOpen, recommendedCouponIds]);

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
