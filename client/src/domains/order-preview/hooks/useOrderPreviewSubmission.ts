import {useNavigate} from 'react-router-dom';

import {useCreateOrder} from '../../order/hooks/useCreateOrder.js';
import type {PreviewOrderResponse} from '../api/orderPreviewApi.js';

interface UseOrderPreviewSubmissionParams {
  preorderId: string | undefined;
  orderPreview: PreviewOrderResponse | null;
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
