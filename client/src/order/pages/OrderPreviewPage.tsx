import {useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';

import {AsyncStateView, Button, ErrorState, LoadingState} from '../../design-system/index.js';
import {PageIntro} from '../../layout/PageIntro.js';
import {ScreenLayout} from '../../layout/ScreenLayout.js';
import {useCoupons} from '../../coupon/hooks/useCoupons.js';
import type {CouponId} from '../../coupon/domain/types.js';
import {OrderPreviewBackButton} from '../components/order-preview/OrderPreviewBackButton.js';
import {CouponModal} from '../components/order-preview/CouponModal.js';
import {OrderPreviewContent} from '../components/order-preview/OrderPreviewContent.js';
import {usePreorder} from '../hooks/usePreorder.js';
import type {PreorderItem} from '../api/orderApi.js';

export const OrderPreviewPage = () => {
  const navigate = useNavigate();
  const {preorderId} = useParams();
  const {errorMessage, errorType, loadPreorder, preorder, status} = usePreorder(preorderId);
  const {coupons, errorMessage: couponErrorMessage, loadCoupons, status: couponsStatus} = useCoupons(preorderId);
  const [isRemoteArea, setIsRemoteArea] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [selectedCouponIds, setSelectedCouponIds] = useState<CouponId[]>([]);
  const itemCount = preorder?.items.length ?? 0;
  const quantity = preorder ? getTotalQuantity(preorder.items) : 0;
  const shouldReturnToCart = errorType === 'expired' || errorType === 'notFound';

  return (
    <ScreenLayout
      header={<OrderPreviewBackButton onClick={() => navigate('/cart')} />}
      bottomButton={<Button disabled>결제하기</Button>}
    >
      <PageIntro
        title='주문 확인'
        description={
          preorder && (
            <>
              총 {itemCount}종류의 상품 {quantity}개를 주문합니다.
              <br />
              최종 결제 금액을 확인해 주세요.
            </>
          )
        }
      />

      <AsyncStateView
        errorFallback={
          <ErrorState
            actionText={shouldReturnToCart ? '장바구니로 돌아가기' : undefined}
            message={errorMessage}
            onAction={shouldReturnToCart ? () => navigate('/cart') : () => void loadPreorder()}
          />
        }
        loadingFallback={<LoadingState />}
        status={status}
      >
        {preorder && (
          <OrderPreviewContent
            isRemoteArea={isRemoteArea}
            preorder={preorder}
            onChangeRemoteArea={setIsRemoteArea}
            onOpenCouponModal={() => setIsCouponModalOpen(true)}
          />
        )}
      </AsyncStateView>

      {isCouponModalOpen && (
        <CouponModal
          coupons={coupons}
          errorMessage={couponErrorMessage}
          selectedCouponIds={selectedCouponIds}
          status={couponsStatus}
          onApply={() => setIsCouponModalOpen(false)}
          onChangeSelectedCouponIds={setSelectedCouponIds}
          onClose={() => setIsCouponModalOpen(false)}
          onRetry={() => void loadCoupons()}
        />
      )}
    </ScreenLayout>
  );
};

export default OrderPreviewPage;

function getTotalQuantity(items: PreorderItem[]) {
  return items.reduce((totalQuantity, item) => totalQuantity + item.quantity, 0);
}
