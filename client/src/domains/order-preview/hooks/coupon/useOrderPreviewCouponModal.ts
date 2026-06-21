import {useCoupons} from '../../../coupon/hooks/useCoupons.js';
import {useCouponAutoSelection} from '../../../coupon/hooks/useCouponAutoSelection.js';
import {useCouponDraftSelection} from '../../../coupon/hooks/useCouponDraftSelection.js';
import type {OrderPreviewStatus} from '../useOrderPreview.js';
import {useOrderPreviewCouponErrorAction} from './useOrderPreviewCouponErrorAction.js';
import {useOrderPreviewCouponPreview} from './useOrderPreviewCouponPreview.js';

type CouponModalStatus = 'loading' | 'success' | 'error';
type CouponsStatus = 'loading' | 'success' | 'error';

export function useOrderPreviewCouponModal(
  preorderId: string | undefined,
  isRemoteArea: boolean,
  onReturnToCart: () => void
) {
  const {
    appliedCouponIds,
    draftCouponIds,
    hasCouponSelectionHistory,
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
    error: modalPreviewError,
    loadOrderPreview: loadModalPreview,
    orderPreview: modalOrderPreview,
    resetOrderPreview: resetModalPreview,
    status: modalPreviewStatus,
  } = useOrderPreviewCouponPreview(preorderId, isRemoteArea, draftCouponIds, isCouponModalOpen);

  const openCouponModal = () => {
    resetModalPreview();
    openDraftCouponModal();
  };
  const retryCoupons = () => {
    void loadCoupons();
    void loadModalPreview();
  };
  const {errorActionText, handleCouponModalError} = useOrderPreviewCouponErrorAction({
    couponErrorType,
    modalPreviewErrorType: modalPreviewError?.type ?? 'default',
    onReturnToCart,
    retryCoupons,
  });

  useCouponAutoSelection({
    couponsStatus,
    hasCouponSelectionHistory,
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
      errorMessage: getCouponModalErrorMessage(couponErrorMessage, modalPreviewError?.message ?? '', couponsStatus),
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
