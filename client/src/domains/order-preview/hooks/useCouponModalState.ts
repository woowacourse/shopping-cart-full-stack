import {useCoupons} from '../../coupon/hooks/useCoupons.js';
import {useCouponAutoSelection} from './useCouponAutoSelection.js';
import {useCouponDraftSelection} from './useCouponDraftSelection.js';
import {useCouponModalErrorAction} from './useCouponModalErrorAction.js';
import {useCouponModalPreview} from './useCouponModalPreview.js';
import type {OrderPreviewStatus} from './useOrderPreview.js';

type CouponModalStatus = 'loading' | 'success' | 'error';
type CouponsStatus = 'loading' | 'success' | 'error';

export function useCouponModalState(
  preorderId: string | undefined,
  isRemoteArea: boolean,
  onReturnToCart: () => void
) {
  const {
    appliedCouponIds,
    draftCouponIds,
    isCouponModalOpen,
    applyDraftCouponIds,
    closeCouponModal,
    openCouponModal: openDraftCouponModal,
    setDraftCouponIds,
  } = useCouponDraftSelection();
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
  } = useCouponModalPreview(preorderId, isRemoteArea, draftCouponIds, isCouponModalOpen);

  const openCouponModal = () => {
    resetModalPreview();
    openDraftCouponModal();
  };
  const retryCoupons = () => {
    void loadCoupons();
    void loadModalPreview();
  };
  const {errorActionText, handleCouponModalError} = useCouponModalErrorAction({
    couponErrorType,
    modalPreviewErrorType,
    onReturnToCart,
    retryCoupons,
  });

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
      errorActionText,
      selectedCouponIds: draftCouponIds,
      status: getCouponModalStatus(couponsStatus, modalPreviewStatus),
    },
    couponModalActions: {
      changeSelectedCouponIds: setDraftCouponIds,
      applyCouponSelection: applyDraftCouponIds,
      closeCouponModal,
      openCouponModal,
      handleCouponModalError,
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
