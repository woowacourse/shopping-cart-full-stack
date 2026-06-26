import styled from '@emotion/styled';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice';

export default function PaymentConfirmPage() {
  const { id: orderId } = useParams();

  const location = useLocation();
  if (!location.state) return <Navigate to={`/order/${orderId}`} replace />;

  const { productTypeCount, totalQuantity, totalPrice } = location.state;

  return (
    <Container>
      <Content>
        <Title>결제 확인</Title>
        <Description>
          총 {productTypeCount}종류의 상품 {totalQuantity}개를 주문했습니다.
          <br />
          최종 결제 금액을 확인해 주세요.
        </Description>
        <TotalPrice>
          <span>총 결제 금액</span>
          <strong>{formatPrice(totalPrice)}</strong>
        </TotalPrice>
      </Content>
      <Footer />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #000;
`;

const Description = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #0a0d13;
  text-align: center;
`;

const TotalPrice = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;

  span {
    font-size: 16px;
    font-weight: 700;
    color: #0a0d13;
  }

  strong {
    font-size: 24px;
    font-weight: 700;
    color: #000;
  }
`;

const Footer = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  min-width: 430px;
  max-width: 1280px;
  width: 100%;
  height: 64px;
  background-color: #000;
`;
