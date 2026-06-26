import styled from "@emotion/styled";
import { useLocation, useNavigate } from "react-router-dom";

export default function PaymentConfirm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalPayment, totalProductsTypeCount, totalProductsQuantity } =
    location.state ?? {};

  return (
    <Container>
      <Header />
      <Main>
        <h2>결제 확인</h2>
        <Intro>
          <p>
            총 {totalProductsTypeCount}종류의 상품 {totalProductsQuantity}개를
            주문했습니다.
          </p>
          <p>최종 결제 금액을 확인해 주세요.</p>
        </Intro>
        <Price>
          <h4>총 결제 금액</h4>
          <p>{Number(totalPayment ?? 0).toLocaleString()}원</p>
        </Price>
      </Main>
      <BackButton onClick={() => navigate("/")}>장바구니로 돌아가기</BackButton>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 100px 24px;
`;

const Header = styled.header`
  background-color: rgba(0, 0, 0, 1);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 64px;
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  min-height: calc(100vh - 200px);

  h2 {
    margin: 0;
    font-family: "Noto Sans", sans-serif;
    font-weight: 700;
    font-size: 24px;
    color: rgba(0, 0, 0, 1);
  }
`;

const Intro = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Noto Sans", sans-serif;
  font-weight: 500;
  font-size: 12px;
  line-height: 150%;
  color: rgba(10, 13, 19, 1);

  p {
    margin: 0;
  }
`;

const Price = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  h4 {
    margin: 0;
    font-family: "Noto Sans", sans-serif;
    font-weight: 700;
    font-size: 16px;
    color: rgba(10, 13, 19, 1);
  }

  p {
    margin: 0;
    font-family: "Noto Sans", sans-serif;
    font-weight: 700;
    font-size: 24px;
    color: rgba(0, 0, 0, 1);
  }
`;

const BackButton = styled.button`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 64px;
  background-color: rgba(0, 0, 0, 1);
  border: none;
  cursor: pointer;
  font-family: "Noto Sans", sans-serif;
  font-weight: 700;
  font-size: 16px;
  color: rgba(255, 255, 255, 1);
`;
