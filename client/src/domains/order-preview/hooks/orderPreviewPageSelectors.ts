import type {AsyncStatus} from '../../../design-system/feedback/AsyncStateView.js';
import type {PreorderItem} from '../../preorder/domain/types.js';
import type {OrderPreviewStatus} from './useOrderPreview.js';
import type {PreorderErrorType, PreorderStatus} from '../../preorder/hooks/usePreorder.js';

interface PageErrorMessageParams {
  orderPreviewErrorMessage: string;
  preorderErrorMessage: string;
  preorderStatus: PreorderStatus;
}

export function getPreorderSummary(items: PreorderItem[] | undefined) {
  if (!items) {
    return {
      itemCount: 0,
      quantity: 0,
    };
  }

  return {
    itemCount: items.length,
    quantity: items.reduce((totalQuantity, item) => totalQuantity + item.quantity, 0),
  };
}

export function getOrderPreviewPageStatus(
  preorderStatus: PreorderStatus,
  orderPreviewStatus: OrderPreviewStatus
): AsyncStatus {
  if (preorderStatus === 'error' || orderPreviewStatus === 'error') return 'error';
  if (preorderStatus === 'loading' || orderPreviewStatus === 'loading') return 'loading';

  return 'success';
}

export function getOrderPreviewPageErrorMessage({
  orderPreviewErrorMessage,
  preorderErrorMessage,
  preorderStatus,
}: PageErrorMessageParams) {
  if (preorderStatus === 'error') return preorderErrorMessage;

  return orderPreviewErrorMessage;
}

export function getShouldReturnToCart(errorType: PreorderErrorType) {
  return errorType === 'expired' || errorType === 'notFound';
}
