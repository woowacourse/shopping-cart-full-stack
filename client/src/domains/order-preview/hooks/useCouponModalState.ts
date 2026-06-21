import {useState} from 'react';

import type {CouponId} from '../../coupon/domain/types.js';
import {useCoupons, type CouponsErrorType} from '../../coupon/hooks/useCoupons.js';
import {useOrderPreview, type OrderPreviewErrorType, type OrderPreviewStatus} from './useOrderPreview.js';
import {useCouponAutoSelection} from './useCouponAutoSelection.js';

type CouponModalStatus = 'loading' | 'success' | 'error';
type CouponsStatus = 'loading' | 'success' | 'error';

export function useCouponModalState(
  preorderId: string | undefined,
  isRemoteArea: boolean,
  onReturnToCart: () => void
) {
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [appliedCouponIds, setAppliedCouponIds] = useState<CouponId[]>([]);
  const [draftCouponIds, setDraftCouponIds] = useState<CouponId[]>([]);
  const {
    coupons,
    errorMessage: couponErrorMessage,
    errorType: couponErrorType,
    loadCoupons,
    recommendedCouponIds,
    status: couponsStatus,
  } = useCoupons(preorderId, isRemoteArea);
  const {
    errorMessage: modalPreviewErrorMessage,
    errorType: modalPreviewErrorType,
    loadOrderPreview: loadModalPreview,
    orderPreview: modalOrderPreview,
    resetOrderPreview: resetModalPreview,
    status: modalPreviewStatus,
  } = useOrderPreview(preorderId, isRemoteArea, draftCouponIds, {
    enabled: isCouponModalOpen,
    keepPrevious: true,
  });

  const openCouponModal = () => {
    resetModalPreview();
    setDraftCouponIds(appliedCouponIds);
    setIsCouponModalOpen(true);
  };
  const closeCouponModal = () => {
    setIsCouponModalOpen(false);
  };
  const applyDraftCouponIds = () => {
    setAppliedCouponIds(draftCouponIds);
    setIsCouponModalOpen(false);
  };
  const retryCoupons = () => {
    void loadCoupons();
    void loadModalPreview();
  };
  const shouldReturnToCart = getShouldReturnToCart(couponErrorType, modalPreviewErrorType);

  useCouponAutoSelection({
    couponsStatus,
    isCouponModalOpen,
    onSelectCoupons: setDraftCouponIds,
    recommendedCouponIds,
    selectedCouponIds: draftCouponIds,
  });

  return {
    appliedCouponIds,
    couponModal: {
      isOpen: isCouponModalOpen,
      coupons,
      discountAmount: modalOrderPreview?.price.totalDiscountAmount ?? 0,
      errorMessage: getCouponModalErrorMessage(couponErrorMessage, modalPreviewErrorMessage, couponsStatus),
      errorActionText: shouldReturnToCart ? '장바구니로 돌아가기' : '다시 시도',
      selectedCouponIds: draftCouponIds,
      status: getCouponModalStatus(couponsStatus, modalPreviewStatus),
    },
    couponModalActions: {
      changeSelectedCouponIds: setDraftCouponIds,
      applyCouponSelection: applyDraftCouponIds,
      closeCouponModal,
      openCouponModal,
      handleCouponModalError: shouldReturnToCart ? onReturnToCart : retryCoupons,
      retryCoupons,
    },
  };
}

function getCouponModalStatus(
  couponsStatus: CouponsStatus,
  modalPreviewStatus: OrderPreviewStatus
): CouponModalStatus {
  if (couponsStatus === 'error' || modalPreviewStatus === 'error') return 'error';
  if (couponsStatus === 'loading') return 'loading';

  return 'success';
}

function getCouponModalErrorMessage(
  couponErrorMessage: string,
  modalPreviewErrorMessage: string,
  couponsStatus: CouponsStatus
) {
  if (couponsStatus === 'error') return couponErrorMessage;

  return modalPreviewErrorMessage;
}

function getShouldReturnToCart(couponErrorType: CouponsErrorType, modalPreviewErrorType: OrderPreviewErrorType) {
  return (
    couponErrorType === 'expired' ||
    couponErrorType === 'notFound' ||
    modalPreviewErrorType === 'expired' ||
    modalPreviewErrorType === 'notFound'
  );
}
