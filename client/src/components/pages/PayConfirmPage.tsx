import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

export default function PayConfirmPage() {
  const { state } = useLocation();
  const { itemCount, orderQuantity, totalAmount } = state;
  const navigate = useNavigate();

  return (
    <Container>
      <InfoSection>
        <Title>결제확인</Title>
        <Description>
          총 {itemCount}종류의 상품 {orderQuantity}개를 주문했습니다. <br />
          최종결제 금액을 확인해주세요.
        </Description>
        <Text>총 결제 금액</Text>
        <Result>{totalAmount.toLocaleString()}원</Result>
      </InfoSection>
      <Button onClick={() => navigate("/cart")}>장바구니로 돌아가기</Button>
    </Container>
  );
}

const Container = styled.div``;
const InfoSection = styled.div``;
const Title = styled.p``;
const Description = styled.p``;
const Text = styled.p``;
const Result = styled.p``;
const Button = styled.button`
  width: 100%;
  height: 64px;
  font-size: 16px;
  font-weight: 700;
  font-family: sans-serif;
  color: #ffffff;
  background-color: #000000;
  margin-top: auto;
  cursor: pointer;
`;
