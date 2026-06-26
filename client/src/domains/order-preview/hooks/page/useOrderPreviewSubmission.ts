import {useNavigate} from 'react-router-dom';

import {useCreateOrder} from '../../../order/hooks/useCreateOrder.js';
import type {PreviewOrder} from '../../domain/types.js';

interface UseOrderPreviewSubmissionParams {
  preorderId: string | undefined;
  orderPreview: PreviewOrder | null;
  canSubmit: boolean;
  onConflict: () => Promise<void>;
}

export function useOrderPreviewSubmission({
  preorderId,
  orderPreview,
  canSubmit,
  onConflict,
}: UseOrderPreviewSubmissionParams) {
  const navigate = useNavigate();
  const {
    errorMessage: orderSubmitErrorMessage,
    isSubmitting: isOrderSubmitting,
    submitOrder,
  } = useCreateOrder();

  const submitCurrentOrder = async () => {
    if (!preorderId || !orderPreview) return;

    const result = await submitOrder({
      preorderId,
      expectedTotalPaymentAmount: orderPreview.price.totalPaymentAmount,
    });

    if (!result) return;

    if (result.status === 'error') {
      if (result.error.status === 409) {
        await onConflict();
      }

      return;
    }

    navigate(`/order-confirm/${result.order.orderId}`);
  };

  return {
    orderSubmit: {
      errorMessage: orderSubmitErrorMessage,
      isSubmitting: isOrderSubmitting,
      canSubmit: canSubmit && !isOrderSubmitting,
    },
    submitOrder: () => void submitCurrentOrder(),
  };
}
