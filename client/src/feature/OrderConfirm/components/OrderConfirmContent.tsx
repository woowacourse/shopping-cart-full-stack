import styled from 'styled-components';
import type { OrderConfirmSummary } from '../types/orderConfirm.types';

export const OrderContent = ({
  orderSummary,
}: {
  orderSummary: OrderConfirmSummary;
}) => {
  return (
    <ContentContainer>
      <Title>주문 확인</Title>
      <Description>
        총 {orderSummary.productKindCount}종류의 상품{' '}
        {orderSummary.totalProductCount}개를 주문했습니다.
        <br />
        최종 결제 금액을 확인해 주세요.
      </Description>

      <TotalPriceSection>
        <TotalPriceTitle>총 결제 금액</TotalPriceTitle>
        <TotalPrice>{orderSummary.totalPrice.toLocaleString()}원</TotalPrice>
      </TotalPriceSection>
    </ContentContainer>
  );
};

const ContentContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;

  color: #000000;
  text-align: center;
`;

const Title = styled.h1`
  margin: 0 0 28px;

  font-size: 24px;
  font-weight: 900;
  line-height: 1.2;
`;

const Description = styled.p`
  margin: 0 0 34px;

  font-size: 12px;
  font-weight: 700;
  line-height: 1.6;
`;

const TotalPriceSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const TotalPriceTitle = styled.h2`
  margin: 0;

  font-size: 16px;
  font-weight: 900;
  line-height: 1.2;
`;

const TotalPrice = styled.strong`
  font-size: 28px;
  font-weight: 900;
  line-height: 1.1;
`;
