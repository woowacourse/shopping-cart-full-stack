import {PageIntro} from '../../../layout/PageIntro.js';
import {OrderPreviewSuccessContent} from './OrderPreviewSuccessContent.js';
import {OrderSubmitErrorMessage} from './OrderSubmitErrorMessage.js';
import {useOrderPreviewPage} from '../hooks/useOrderPreviewPage.js';

export const OrderPreviewSuccessView = () => {
  const {intro} = useOrderPreviewPage();

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
      <OrderPreviewSuccessContent />
      <OrderSubmitErrorMessage />
    </>
  );
};
