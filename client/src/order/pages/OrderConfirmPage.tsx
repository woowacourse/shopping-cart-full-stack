import styled from '@emotion/styled';
import {useNavigate} from 'react-router-dom';

import {Button, fontWeights, theme, typography} from '../../design-system/index.js';
import {ScreenLayout} from '../../layout/ScreenLayout.js';

const orderConfirm = {
  itemCount: 1,
  quantity: 2,
  totalPaymentAmount: 70000,
};

export const OrderConfirmPage = () => {
  const navigate = useNavigate();

  return (
    <ScreenLayout
      bottomButton={<Button onClick={() => navigate('/cart')}>장바구니로 돌아가기</Button>}
      header={null}
    >
      <Summary>
        <Title>결제 확인</Title>
        <Description>
          총 {orderConfirm.itemCount}종류의 상품 {orderConfirm.quantity}개를 주문했습니다.
          <br />
          최종 결제 금액을 확인해 주세요.
        </Description>
        <TotalLabel>총 결제 금액</TotalLabel>
        <TotalPrice>{orderConfirm.totalPaymentAmount.toLocaleString('ko-KR')}원</TotalPrice>
      </Summary>
    </ScreenLayout>
  );
};

const Summary = styled.section`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 56px;
  text-align: center;
`;

const Title = styled.h1`
  margin: 0;
  color: ${theme.colors.black};
  font-size: ${typography.display.fontSize};
  font-weight: ${fontWeights.bold};
  line-height: ${typography.display.lineHeight};
`;

const Description = styled.p`
  margin: 27px 0 0;
  color: ${theme.colors.textPrimary};
  font-size: ${typography.caption.fontSize};
  font-weight: ${fontWeights.medium};
  line-height: 150%;
  text-align: center;
`;

const TotalLabel = styled.strong`
  margin-top: 24px;
  color: ${theme.colors.textPrimary};
  font-size: ${typography.body.fontSize};
  font-weight: ${fontWeights.bold};
  line-height: 16px;
  text-align: center;
`;

const TotalPrice = styled.strong`
  margin-top: 12px;
  color: ${theme.colors.black};
  font-size: ${typography.display.fontSize};
  font-weight: ${fontWeights.bold};
  line-height: ${typography.display.lineHeight};
  text-align: center;
`;
