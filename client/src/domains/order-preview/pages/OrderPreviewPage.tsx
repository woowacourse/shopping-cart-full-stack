import {AsyncStateView, Button, ErrorState} from '../../../design-system/index.js';

import {ScreenLayout} from '../../../shared/layout/ScreenLayout.js';

import {OrderPreviewBackButton} from '../components/page/OrderPreviewBackButton.js';
import {OrderPreviewCouponModal} from '../components/page/OrderPreviewCouponModal.js';
import {OrderPreviewSuccessView} from '../components/page/OrderPreviewSuccessView.js';

import {useOrderPreviewPage} from '../hooks/useOrderPreviewPage.js';

export const OrderPreviewPage = () => {
  const {actions, orderSubmit, page} = useOrderPreviewPage();

  return (
    <ScreenLayout
      header={<OrderPreviewBackButton onClick={actions.navigateToCart} />}
      bottomButton={
        <Button disabled={!orderSubmit.canSubmit} onClick={actions.submitOrder}>
          {orderSubmit.isSubmitting ? '결제 중' : '결제하기'}
        </Button>
      }
    >
      <AsyncStateView
        errorFallback={
          <ErrorState
            actionText={page.shouldReturnToCart ? '장바구니로 돌아가기' : undefined}
            message={page.errorMessage}
            onAction={actions.errorAction}
          />
        }
        status={page.status}
      >
        <OrderPreviewSuccessView />
      </AsyncStateView>

      <OrderPreviewCouponModal />
    </ScreenLayout>
  );
};

export default OrderPreviewPage;
