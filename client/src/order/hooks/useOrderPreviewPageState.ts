import {useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';

import type {CouponId} from '../../coupon/domain/types.js';
import {useCoupons} from '../../coupon/hooks/useCoupons.js';
import {useOrderPreview} from './useOrderPreview.js';
import {usePreorder, type PreorderStatus} from './usePreorder.js';
import {
  getOrderPreviewPageErrorMessage,
  getOrderPreviewPageStatus,
  getPreorderSummary,
  getShouldReturnToCart,
} from './orderPreviewPageSelectors.js';
import {useCouponAutoSelection} from './useCouponAutoSelection.js';

export type OrderPreviewPageState = ReturnType<typeof useOrderPreviewPageState>;

export function useOrderPreviewPageState() {
  const navigate = useNavigate();
  const {preorderId} = useParams();
  const [isRemoteArea, setIsRemoteArea] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [selectedCouponIds, setSelectedCouponIds] = useState<CouponId[]>([]);
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
  } = useOrderPreview(preorderId, isRemoteArea, selectedCouponIds);

  const navigateToCart = () => navigate('/cart');
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
    onSelectCoupons: setSelectedCouponIds,
    recommendedCouponIds,
    selectedCouponIds,
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
      discountAmount: orderPreview?.price.totalDiscountAmount ?? 0,
      errorMessage: couponErrorMessage,
      selectedCouponIds,
      status: couponsStatus,
    },
    actions: {
      navigateToCart,
      errorAction,
      changeRemoteArea: setIsRemoteArea,
      changeSelectedCouponIds: setSelectedCouponIds,
      closeCouponModal: () => setIsCouponModalOpen(false),
      openCouponModal: () => setIsCouponModalOpen(true),
      retryCoupons: () => void loadCoupons(),
    },
  };
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
