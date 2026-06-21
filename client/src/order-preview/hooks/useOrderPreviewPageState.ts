import {useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';

import type {CouponId} from '../../coupon/domain/types.js';
import {useCoupons} from '../../coupon/hooks/useCoupons.js';
import {useCreateOrder} from '../../order/hooks/useCreateOrder.js';
import {useOrderPreview, type OrderPreviewStatus} from './useOrderPreview.js';
import {usePreorder, type PreorderStatus} from '../../preorder/hooks/usePreorder.js';
import {
  getOrderPreviewPageErrorMessage,
  getOrderPreviewPageStatus,
  getPreorderSummary,
  getShouldReturnToCart,
} from './orderPreviewPageSelectors.js';
import {useCouponAutoSelection} from './useCouponAutoSelection.js';

export type OrderPreviewPageState = ReturnType<typeof useOrderPreviewPageState>;
type CouponModalStatus = 'loading' | 'success' | 'error';
type CouponsStatus = 'loading' | 'success' | 'error';

export function useOrderPreviewPageState() {
  const navigate = useNavigate();
  const {preorderId} = useParams();
  const [isRemoteArea, setIsRemoteArea] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [appliedCouponIds, setAppliedCouponIds] = useState<CouponId[]>([]);
  const [draftCouponIds, setDraftCouponIds] = useState<CouponId[]>([]);
  const {
    errorMessage: orderSubmitErrorMessage,
    isSubmitting: isOrderSubmitting,
    submitOrder,
  } = useCreateOrder();
  const {
    errorMessage: preorderErrorMessage,
    errorType,
    loadPreorder,
    preorder,
    status: preorderStatus,
  } = usePreorder(preorderId);
  const {
    coupons,
    errorMessage: couponErrorMessage,
    loadCoupons,
    recommendedCouponIds,
    status: couponsStatus,
  } = useCoupons(preorderId, isRemoteArea);
  const {
    errorMessage: orderPreviewErrorMessage,
    loadOrderPreview,
    orderPreview,
    status: orderPreviewStatus,
  } = useOrderPreview(preorderId, isRemoteArea, appliedCouponIds);
  const {
    errorMessage: modalPreviewErrorMessage,
    loadOrderPreview: loadModalPreview,
    orderPreview: modalOrderPreview,
    resetOrderPreview: resetModalPreview,
    status: modalPreviewStatus,
  } = useOrderPreview(preorderId, isRemoteArea, draftCouponIds, {
    enabled: isCouponModalOpen,
    keepPrevious: true,
  });

  const navigateToCart = () => navigate('/cart');
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
  const submitCurrentOrder = async () => {
    if (!preorderId || !orderPreview) return;

    const order = await submitOrder({
      preorderId,
      expectedTotalPaymentAmount: orderPreview.price.totalPaymentAmount,
    });

    if (!order) return;

    navigate(`/order-confirm/${order.orderId}`);
  };
  const preorderSummary = getPreorderSummary(preorder?.items);
  const shouldReturnToCart = getShouldReturnToCart(errorType);
  const pageStatus = getOrderPreviewPageStatus(preorderStatus, orderPreviewStatus);
  const pageErrorMessage = getOrderPreviewPageErrorMessage({
    orderPreviewErrorMessage,
    preorderErrorMessage,
    preorderStatus,
  });
  const errorAction = getErrorAction({
    loadOrderPreview,
    loadPreorder,
    navigateToCart,
    preorderStatus,
    shouldReturnToCart,
  });

  useCouponAutoSelection({
    couponsStatus,
    isCouponModalOpen,
    onSelectCoupons: setDraftCouponIds,
    recommendedCouponIds,
    selectedCouponIds: draftCouponIds,
  });

  return {
    page: {
      status: pageStatus,
      errorMessage: pageErrorMessage,
      shouldReturnToCart,
    },
    intro: preorderSummary,
    content: {
      preorder,
      orderPreview,
      isRemoteArea,
    },
    couponModal: {
      isOpen: isCouponModalOpen,
      coupons,
      discountAmount: modalOrderPreview?.price.totalDiscountAmount ?? 0,
      errorMessage: getCouponModalErrorMessage(couponErrorMessage, modalPreviewErrorMessage, couponsStatus),
      selectedCouponIds: draftCouponIds,
      status: getCouponModalStatus(couponsStatus, modalPreviewStatus),
    },
    orderSubmit: {
      errorMessage: orderSubmitErrorMessage,
      isSubmitting: isOrderSubmitting,
      canSubmit: pageStatus === 'success' && orderPreview !== null && !isOrderSubmitting,
    },
    actions: {
      navigateToCart,
      errorAction,
      submitOrder: () => void submitCurrentOrder(),
      changeRemoteArea: setIsRemoteArea,
      changeSelectedCouponIds: setDraftCouponIds,
      applyCouponSelection: applyDraftCouponIds,
      closeCouponModal,
      openCouponModal,
      retryCoupons: () => {
        void loadCoupons();
        void loadModalPreview();
      },
    },
  };
}

function getCouponModalStatus(
  couponsStatus: CouponsStatus,
  modalPreviewStatus: OrderPreviewStatus
): CouponModalStatus {
  if (couponsStatus === 'error' || modalPreviewStatus === 'error') return 'error';
  if (couponsStatus === 'loading' || modalPreviewStatus === 'loading') return 'loading';

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

interface ErrorActionParams {
  loadOrderPreview: () => Promise<void>;
  loadPreorder: () => Promise<void>;
  navigateToCart: () => void;
  preorderStatus: PreorderStatus;
  shouldReturnToCart: boolean;
}

function getErrorAction({
  loadOrderPreview,
  loadPreorder,
  navigateToCart,
  preorderStatus,
  shouldReturnToCart,
}: ErrorActionParams) {
  if (shouldReturnToCart) return navigateToCart;
  if (preorderStatus === 'error') return () => void loadPreorder();

  return () => void loadOrderPreview();
}
