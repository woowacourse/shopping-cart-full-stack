import {AsyncStateView, Button, ErrorState, LoadingState} from '../../design-system/index.js';

import {PageIntro} from '../../layout/PageIntro.js';
import {ScreenLayout} from '../../layout/ScreenLayout.js';

import {OrderPreviewBackButton} from '../components/OrderPreviewBackButton.js';
import {OrderPreviewSuccessContent} from '../components/OrderPreviewSuccessContent.js';
import {OrderPreviewCouponModal} from '../components/OrderPreviewCouponModal.js';

import {useOrderPreviewPage} from '../hooks/useOrderPreviewPage.js';

export const OrderPreviewPage = () => {
  const {actions, intro, page} = useOrderPreviewPage();

  return (
    <ScreenLayout
      header={<OrderPreviewBackButton onClick={actions.navigateToCart} />}
      bottomButton={<Button disabled>결제하기</Button>}
    >
      <PageIntro
        title='주문 확인'
        description={
          <>
            총 {intro.itemCount}종류의 상품 {intro.quantity}개를 주문합니다.
            <br />
            최종 결제 금액을 확인해 주세요.
          </>
        }
      />

      <AsyncStateView
        errorFallback={
          <ErrorState
            actionText={page.shouldReturnToCart ? '장바구니로 돌아가기' : undefined}
            message={page.errorMessage}
            onAction={actions.errorAction}
          />
        }
        loadingFallback={<LoadingState />}
        status={page.status}
      >
        <OrderPreviewSuccessContent />
      </AsyncStateView>

      <OrderPreviewCouponModal />
    </ScreenLayout>
  );
};

export default OrderPreviewPage;
