import {useState} from 'react';

import type {CouponId} from '../domain/types.js';

export function useCouponDraftSelection() {
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [appliedCouponIds, setAppliedCouponIds] = useState<CouponId[]>([]);
  const [draftCouponIds, setDraftCouponIds] = useState<CouponId[]>([]);

  const openCouponModal = () => {
    if (draftCouponIds.length === 0 && appliedCouponIds.length > 0) {
      setDraftCouponIds(appliedCouponIds);
    }

    setIsCouponModalOpen(true);
  };

  const closeCouponModal = () => {
    setIsCouponModalOpen(false);
  };

  const applyDraftCouponIds = () => {
    setAppliedCouponIds(draftCouponIds);
    setIsCouponModalOpen(false);
  };

  return {
    appliedCouponIds,
    draftCouponIds,
    isCouponModalOpen,
    applyDraftCouponIds,
    closeCouponModal,
    openCouponModal,
    setDraftCouponIds,
  };
}
