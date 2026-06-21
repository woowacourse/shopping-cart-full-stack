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
  const navigateToCart = () => navigate('/cart');
  const {appliedCouponIds, couponModal, couponModalActions} = useOrderPreviewCouponModal(
    preorderId,
    isRemoteArea,
    navigateToCart
  );
  const {
    errorMessage: orderPreviewErrorMessage,
    loadOrderPreview,
    orderPreview,
    status: orderPreviewStatus,
  } = useOrderPreview(preorderId, isRemoteArea, appliedCouponIds, {
    keepPrevious: true,
  });

  const preorderSummary = getPreorderSummary(preorder?.items);
  const {errorAction, page} = useOrderPreviewPageStatus({
    loadOrderPreview,
    loadPreorder,
    navigateToCart,
    preorderErrorMessage,
    preorderErrorType: errorType,
    preorderStatus,
    orderPreviewErrorMessage,
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
