import styled from "styled-components";
import HeaderButton from "../button/ShopButton";
import { useLocation } from "react-router-dom";

export default function OrderConfirmPage() {
  const location = useLocation();
  const { itemCount, totalQuantity, totalPrice } = location.state;
  return (
    <Body>
      <Nav>
        <HeaderButton />
      </Nav>
      <Title> 주문 확인 </Title>
      <Label>
        총 {itemCount}종류의 상품 {totalQuantity}개를 주문합니다. 최종 결제
        금액을 확인해 주세요.
      </Label>
      <p>총 결제 금액</p>
      <p>{totalPrice}원</p>
    </Body>
  );
}

const Body = styled.div`
  width: 430px;
  height: 936px;
`;

const Nav = styled.nav`
  width: 100%;
  height: 64px;
  background-color: #000000;
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
