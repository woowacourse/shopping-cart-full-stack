import {useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';

import {useOrderPreview} from './useOrderPreview.js';
import {usePreorder, type PreorderStatus} from '../../preorder/hooks/usePreorder.js';
import {
  getOrderPreviewPageErrorMessage,
  getOrderPreviewPageStatus,
  getPreorderSummary,
  getShouldReturnToCart,
} from './orderPreviewPageSelectors.js';
import {useCouponModalState} from './useCouponModalState.js';
import {useOrderPreviewSubmission} from './useOrderPreviewSubmission.js';

export type OrderPreviewPageState = ReturnType<typeof useOrderPreviewPageState>;

export function useOrderPreviewPageState() {
  const navigate = useNavigate();
  const {preorderId} = useParams();
  const [isRemoteArea, setIsRemoteArea] = useState(false);
  const {
    errorMessage: preorderErrorMessage,
    errorType,
    loadPreorder,
    preorder,
    status: preorderStatus,
  } = usePreorder(preorderId);
  const {appliedCouponIds, couponModal, couponModalActions} = useCouponModalState(preorderId, isRemoteArea);
  const {
    errorMessage: orderPreviewErrorMessage,
    loadOrderPreview,
    orderPreview,
    status: orderPreviewStatus,
  } = useOrderPreview(preorderId, isRemoteArea, appliedCouponIds, {
    keepPrevious: true,
  });

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
  const {orderSubmit, submitOrder} = useOrderPreviewSubmission({
    preorderId,
    orderPreview,
    canSubmit: pageStatus === 'success' && orderPreview !== null,
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
    couponModal,
    orderSubmit,
    actions: {
      navigateToCart,
      errorAction,
      submitOrder,
      changeRemoteArea: setIsRemoteArea,
      ...couponModalActions,
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
