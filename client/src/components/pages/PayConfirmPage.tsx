import { useLocation, useNavigate, Navigate } from "react-router-dom";
import styled from "styled-components";

export default function PayConfirmPage() {
  const { state } = useLocation();
  if (!state) return <Navigate to="/cart" replace />;
  const { itemCount, orderQuantity, totalAmount } = state;
  const navigate = useNavigate();

  return (
    <MainContainer>
      <SubContainer>
        <Nav />
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
      </SubContainer>
    </MainContainer>
  );
}
const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  overflow: hidden;
`;
const SubContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 430px;
  height: 100vh;
  overflow: hidden;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  width: 100%;
  height: 64px;
  background-color: #000000;
`;
const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 430px;
  height: 100vh;
  overflow: hidden;
`;
const Title = styled.p`
  font-family: sans-serif;
  font-weight: 700;
  font-size: 24px;
`;
const Description = styled.p`
  align-items: center;
  font-family: sans-serif;
  text-align: center;
  font-weight: 500;
  font-size: 12px;
`;
const Text = styled.p`
  font-family: sans-serif;
  font-weight: 700;
  font-size: 16px;
`;
const Result = styled.p`
  font-family: sans-serif;
  font-weight: 700;
  font-size: 24px;
`;
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
