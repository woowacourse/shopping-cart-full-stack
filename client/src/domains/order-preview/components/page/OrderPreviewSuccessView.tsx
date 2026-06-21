import styled from '@emotion/styled';

import {Typo} from '../../../../design-system/index.js';
import {PageIntro} from '../../../../shared/layout/PageIntro.js';
import {OrderPreviewContent} from '../preview/OrderPreviewContent.js';
import {useOrderPreviewPage} from '../../hooks/useOrderPreviewPage.js';

export const OrderPreviewSuccessView = () => {
  const {actions, content, intro, orderSubmit} = useOrderPreviewPage();
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
          benefitItems={orderPreview.benefitItems}
          isRemoteArea={isRemoteArea}
          price={orderPreview.price}
          preorder={preorder}
          onChangeRemoteArea={actions.changeRemoteArea}
          onOpenCouponModal={actions.openCouponModal}
        />
      )}
      {orderSubmit.errorMessage && (
        <SubmitErrorMessage as='p' color='gray900' variant='caption' weight='medium'>
          {orderSubmit.errorMessage}
        </SubmitErrorMessage>
      )}
    </>
  );
};

const SubmitErrorMessage = styled(Typo)`
  margin-top: 16px;
  text-align: center;
`;
