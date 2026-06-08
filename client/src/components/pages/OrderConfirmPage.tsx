import styled from "styled-components";
import { Navigate, useLocation } from "react-router-dom";

import BackButton from "../button/BackButton";

export default function OrderConfirmPage() {
  const location = useLocation();
  if (!location.state) {
    return <Navigate to="/cart" replace />;
  }
  const { itemCount, totalQuantity, totalPrice } = location.state;
  return (
    <MainContainer>
      <Body>
        <Nav>
          <BackButton />
        </Nav>
        <ConfirmOrderSection>
          <Title> 주문 확인 </Title>
          <Label>
            총 {itemCount}종류의 상품 {totalQuantity}개를 주문합니다. 최종 결제
            금액을 확인해 주세요.
          </Label>
          <TotalPriceLabel>총 결제 금액</TotalPriceLabel>
          <TotalPrice>{totalPrice.toLocaleString()}원</TotalPrice>
        </ConfirmOrderSection>
        <PayButton disabled>결제하기</PayButton>
      </Body>
    </MainContainer>
  );
}
const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 936px;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 430px;
  height: 936px;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  width: 100%;
  height: 64px;
  background-color: #000000;
`;

const ConfirmOrderSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
`;

const Title = styled.div`
  font-size: 24px;
  font-family: sans-serif;
  font-weight: 700;
`;

const Label = styled.div`
  font-size: 12px;
  font-family: sans-serif;
  font-weight: 500;
`;

const TotalPriceLabel = styled.p`
  font-size: 14px;
  font-family: sans-serif;
  font-weight: 500;
  margin: 0;
`;

const TotalPrice = styled.p`
  font-size: 24px;
  font-family: sans-serif;
  font-weight: 700;
  margin: 0;
`;

const PayButton = styled.button`
  width: 100%;
  height: 64px;
  font-size: 16px;
  font-weight: 700;
  font-family: sans-serif;
  color: #ffffff;
  background-color: #bebebe;
  cursor: not-allowed;
`;
