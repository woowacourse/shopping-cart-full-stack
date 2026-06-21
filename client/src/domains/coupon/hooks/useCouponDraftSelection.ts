import {useState} from 'react';

import type {CouponId} from '../domain/types.js';

export function useCouponDraftSelection() {
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [appliedCouponIds, setAppliedCouponIds] = useState<CouponId[]>([]);
  const [draftCouponIds, setDraftCouponIds] = useState<CouponId[]>([]);
  const [hasCouponSelectionHistory, setHasCouponSelectionHistory] = useState(false);

  const openCouponModal = () => {
    if (!hasCouponSelectionHistory && draftCouponIds.length === 0 && appliedCouponIds.length > 0) {
      setDraftCouponIds(appliedCouponIds);
    }

    setIsCouponModalOpen(true);
  };

  const closeCouponModal = () => {
    setIsCouponModalOpen(false);
  };

  const applyDraftCouponIds = () => {
    setAppliedCouponIds(draftCouponIds);
    setHasCouponSelectionHistory(true);
    setIsCouponModalOpen(false);
  };

  const changeDraftCouponIds = (couponIds: CouponId[]) => {
    setDraftCouponIds(couponIds);
    setHasCouponSelectionHistory(true);
  };

  return {
    appliedCouponIds,
    draftCouponIds,
    hasCouponSelectionHistory,
    isCouponModalOpen,
    applyDraftCouponIds,
    closeCouponModal,
    openCouponModal,
    setDraftCouponIds: changeDraftCouponIds,
  };
}
