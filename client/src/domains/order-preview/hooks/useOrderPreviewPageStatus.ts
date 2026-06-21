import type {PreorderErrorType, PreorderStatus} from '../../preorder/hooks/usePreorder.js';
import type {OrderPreviewStatus} from './useOrderPreview.js';
import {
  getOrderPreviewPageErrorMessage,
  getOrderPreviewPageStatus,
  getShouldReturnToCart,
} from './orderPreviewPageSelectors.js';

interface UseOrderPreviewPageStatusParams {
  loadOrderPreview: () => Promise<void>;
  loadPreorder: () => Promise<void>;
  navigateToCart: () => void;
  orderPreviewErrorMessage: string;
  orderPreviewStatus: OrderPreviewStatus;
  preorderErrorMessage: string;
  preorderErrorType: PreorderErrorType;
  preorderStatus: PreorderStatus;
}

export function useOrderPreviewPageStatus({
  loadOrderPreview,
  loadPreorder,
  navigateToCart,
  orderPreviewErrorMessage,
  orderPreviewStatus,
  preorderErrorMessage,
  preorderErrorType,
  preorderStatus,
}: UseOrderPreviewPageStatusParams) {
  const shouldReturnToCart = getShouldReturnToCart(preorderErrorType);
  const status = getOrderPreviewPageStatus(preorderStatus, orderPreviewStatus);
  const errorMessage = getOrderPreviewPageErrorMessage({
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

  return {
    page: {
      status,
      errorMessage,
      shouldReturnToCart,
    },
    errorAction,
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
