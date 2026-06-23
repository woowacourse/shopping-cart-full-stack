import {useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';

import {useOrderPreview} from './useOrderPreview.js';
import {usePreorder} from '../../preorder/hooks/usePreorder.js';
import {useOrderPreviewCouponModal} from './coupon/useOrderPreviewCouponModal.js';

import {getPreorderSummary} from './page/orderPreviewPageSelectors.js';
import {useOrderPreviewPageStatus} from './page/useOrderPreviewPageStatus.js';
import {useOrderPreviewSubmission} from './page/useOrderPreviewSubmission.js';

export type OrderPreviewPageState = ReturnType<typeof useOrderPreviewPageState>;

export function useOrderPreviewPageState() {
  const {preorderId} = useParams();

  const navigate = useNavigate();
  const navigateToCart = () => navigate('/cart');

  const [isRemoteArea, setIsRemoteArea] = useState(false);

  const {error: preorderError, loadPreorder, preorder, status: preorderStatus} = usePreorder(preorderId);

  const {appliedCouponIds, couponModal, couponModalActions} = useOrderPreviewCouponModal({
    preorderId,
    isRemoteArea,
    onReturnToCart: navigateToCart,
  });

  const {
    error: orderPreviewError,
    loadOrderPreview,
    orderPreview,
    status: orderPreviewStatus,
  } = useOrderPreview({
    preorderId,
    isRemoteArea,
    couponIds: appliedCouponIds,
  });

  const preorderSummary = getPreorderSummary(preorder?.items);
  const {errorAction, page} = useOrderPreviewPageStatus({
    loadOrderPreview,
    loadPreorder,
    navigateToCart,
    preorderErrorMessage: preorderError?.message ?? '',
    preorderErrorType: preorderError?.type ?? 'default',
    preorderStatus,
    orderPreviewErrorMessage: orderPreviewError?.message ?? '',
    orderPreviewStatus,
  });
  const {orderSubmit, submitOrder} = useOrderPreviewSubmission({
    preorderId,
    orderPreview,
    canSubmit: page.status === 'success' && orderPreview !== null,
  });

  return {
    page,
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
