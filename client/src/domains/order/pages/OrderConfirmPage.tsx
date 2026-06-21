import styled from '@emotion/styled';
import {useNavigate, useParams} from 'react-router-dom';

import {
  AsyncStateView,
  Button,
  ErrorState,
  LoadingState,
  fontWeights,
  theme,
  typography,
} from '../../../design-system/index.js';
import {ScreenLayout} from '../../../layout/ScreenLayout.js';
import type {OrderSummary} from '../api/orderApi.js';
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
        {orderSummary && <OrderConfirmSummary orderSummary={orderSummary} />}
      </AsyncStateView>
    </ScreenLayout>
  );
};

interface OrderConfirmSummaryProps {
  orderSummary: OrderSummary;
}

const OrderConfirmSummary = ({orderSummary}: OrderConfirmSummaryProps) => {
  return (
    <Summary>
      <Title>결제 확인</Title>
      <Description>
        총 {orderSummary.itemCount}종류의 상품 {orderSummary.totalQuantity}개를 주문했습니다.
        <br />
        최종 결제 금액을 확인해 주세요.
      </Description>
      <TotalLabel>총 결제 금액</TotalLabel>
      <TotalPrice>{orderSummary.totalAmount.toLocaleString('ko-KR')}원</TotalPrice>
    </Summary>
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
