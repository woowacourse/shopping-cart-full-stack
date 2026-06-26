import styled from '@emotion/styled';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import Button from '../components/Button';
import { useOrderSheet } from '../hooks/useOrderSheet';
import { useOrderSheetPricing } from '../hooks/useOrderSheetPricing';
import PaymentContent from './components/PaymentContent';

const PaymentAmountPage = () => {
  const navigate = useNavigate();
  const { orderSheetId } = useParams();
  const {
    orderSheet,
    isLoading: isOrderSheetLoading,
    error: orderSheetError,
  } = useOrderSheet(orderSheetId);
  const {
    pricing,
    isLoading: isPricingLoading,
    error: pricingError,
  } = useOrderSheetPricing(orderSheetId);

  if (!orderSheetId) {
    return <Navigate to="/" replace />;
  }

  const productTypeCount = orderSheet?.items.length ?? 0;
  const productQuantity =
    orderSheet?.items.reduce((total, item) => total + item.quantity, 0) ?? 0;
  const isInitialLoading =
    (isOrderSheetLoading || isPricingLoading) && (!orderSheet || !pricing);
  const initialError = orderSheetError ?? (!pricing ? pricingError : null);

  return (
    <PageLayout>
      <PaymentContent isLoading={isInitialLoading} error={initialError}>
        {orderSheet && pricing && (
          <Content>
            <Title>결제 확인</Title>
            <Description>
              총 {productTypeCount}종류의 상품 {productQuantity}개를 주문합니다.
              <br />
              최종 결제 금액을 확인해 주세요.
            </Description>

            <PaymentLabel>총 결제 금액</PaymentLabel>
            <PaymentAmount>
              {pricing.totalPaymentAmount.toLocaleString()}원
            </PaymentAmount>
          </Content>
        )}
      </PaymentContent>

      <BottomButtonWrapper>
        <Button fullWidth onClick={() => navigate('/')}>
          장바구니로 돌아가기
        </Button>
      </BottomButtonWrapper>
    </PageLayout>
  );
};

const Content = styled.section`
  min-height: calc(100vh - 12.5rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const Title = styled.h2`
  margin: 0;
  font-weight: 700;
  font-size: 1.5rem;
`;

const Description = styled.p`
  margin-top: 1.5rem;
  font-weight: 700;
  font-size: 0.75rem;
  line-height: 1.5;
`;

const PaymentLabel = styled.strong`
  margin-top: 1.5rem;
  font-weight: 700;
  font-size: 1rem;
`;

const PaymentAmount = styled.strong`
  margin-top: 0.75rem;
  font-weight: 700;
  font-size: 1.5rem;
`;

const BottomButtonWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  width: 100%;
  max-width: 26rem;
  transform: translateX(-50%);
  z-index: 100;
`;

export default PaymentAmountPage;
