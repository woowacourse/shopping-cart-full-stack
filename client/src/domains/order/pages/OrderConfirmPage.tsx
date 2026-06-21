import {useNavigate, useParams} from 'react-router-dom';

import {AsyncStateView, Button, ErrorState, LoadingState} from '../../../design-system/index.js';
import {ScreenLayout} from '../../../shared/layout/ScreenLayout.js';
import {OrderConfirmSuccessView} from '../components/OrderConfirmSuccessView.js';
import {useOrderSummary} from '../hooks/useOrderSummary.js';

export const OrderConfirmPage = () => {
  const navigate = useNavigate();
  const {orderId} = useParams();
  const {errorMessage, loadOrderSummary, orderSummary, status} = useOrderSummary(orderId);

  return (
    <ScreenLayout bottomButton={<Button onClick={() => navigate('/cart')}>장바구니로 돌아가기</Button>} header={null}>
      <AsyncStateView
        errorFallback={<ErrorState message={errorMessage} onAction={loadOrderSummary} />}
        loadingFallback={<LoadingState />}
        status={status}
      >
        {orderSummary && <OrderConfirmSuccessView orderSummary={orderSummary} />}
      </AsyncStateView>
    </ScreenLayout>
  );
};
