import {PageIntro} from '../../../../shared/layout/PageIntro.js';
import {OrderPreviewContent} from '../preview/OrderPreviewContent.js';
import {OrderSubmitErrorMessage} from './OrderSubmitErrorMessage.js';
import {useOrderPreviewPage} from '../../hooks/useOrderPreviewPage.js';

export const OrderPreviewSuccessView = () => {
  const {actions, content, intro} = useOrderPreviewPage();
  const {isRemoteArea, orderPreview, preorder} = content;

  return (
    <>
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
      {preorder && orderPreview && (
        <OrderPreviewContent
          isRemoteArea={isRemoteArea}
          price={orderPreview.price}
          preorder={preorder}
          onChangeRemoteArea={actions.changeRemoteArea}
          onOpenCouponModal={actions.openCouponModal}
        />
      )}
      <OrderSubmitErrorMessage />
    </>
  );
};
