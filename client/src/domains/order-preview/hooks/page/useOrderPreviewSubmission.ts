import {useNavigate} from 'react-router-dom';

import {useCreateOrder} from '../../../order/hooks/useCreateOrder.js';
import type {PreviewOrder} from '../../domain/types.js';

interface UseOrderPreviewSubmissionParams {
  preorderId: string | undefined;
  orderPreview: PreviewOrder | null;
  canSubmit: boolean;
}

export function useOrderPreviewSubmission({preorderId, orderPreview, canSubmit}: UseOrderPreviewSubmissionParams) {
  const navigate = useNavigate();
  const {
    errorMessage: orderSubmitErrorMessage,
    isSubmitting: isOrderSubmitting,
    submitOrder,
  } = useCreateOrder();

  const submitCurrentOrder = async () => {
    if (!preorderId || !orderPreview) return;

    const order = await submitOrder({
      preorderId,
      expectedTotalPaymentAmount: orderPreview.price.totalPaymentAmount,
    });

    if (!order) return;

    navigate(`/order-confirm/${order.orderId}`);
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
