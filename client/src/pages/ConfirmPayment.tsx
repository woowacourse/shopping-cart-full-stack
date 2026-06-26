import styled from '@emotion/styled';
import { useLocation, useNavigate } from 'react-router-dom';

interface OrderState {
  totalAmount: number;
  productCount: number;
  totalQuantity: number;
}

function ConfirmPayment() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as OrderState;

  return (
    <PageContainer>
      <Banner>
        <button id="back-button" onClick={() => navigate(-1)}>
          <svg
            width="25"
            height="23"
            viewBox="0 0 25 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.9209 11.3537L0.749595 10.4167L-3.8743e-05 11.3537L0.749595 12.2908L1.9209 11.3537ZM22.7542 12.8537C23.5827 12.8537 24.2542 12.1821 24.2542 11.3537C24.2542 10.5253 23.5827 9.85371 22.7542 9.85371V12.8537ZM9.08293 -2.98023e-07L0.749595 10.4167L3.0922 12.2908L11.4255 1.87408L9.08293 -2.98023e-07ZM0.749595 12.2908L9.08293 22.7074L11.4255 20.8333L3.0922 10.4167L0.749595 12.2908ZM1.9209 12.8537H22.7542V9.85371H1.9209V12.8537Z"
              fill="white"
            />
          </svg>
        </button>
      </Banner>
      <ContentArea>
        <h1 id="order-title">결제 확인</h1>
        <p id="order-summary">
          총 {state.productCount}종류의 상품 {state.totalQuantity}개를 주문했습니다.
          <br />
          최종 결제 금액을 확인해 주세요.
        </p>
        <h3 id="total-title">총 결제 금액</h3>
        <p id="total-amount">{state.totalAmount.toLocaleString()}원</p>
      </ContentArea>
      <ConfirmButton onClick={() => navigate('/')}>장바구니로 돌아가기</ConfirmButton>
    </PageContainer>
  );
}

export default ConfirmPayment;

const PageContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Banner = styled.div`
  background-color: #000000;
  width: 100%;
  height: 64px;
  box-sizing: border-box;
  padding-left: 1.5rem;
  display: flex;
  align-items: center;

  #back-button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;

  #order-title {
    font-family: Noto Sans KR;
    font-weight: 700;
    font-style: Bold;
    font-size: 24px;
    line-height: 100%;
    letter-spacing: 0%;
    vertical-align: middle;
    margin-bottom: 0.9375rem;
  }

  #order-summary {
    font-family: Noto Sans;
    font-weight: 500;
    font-style: Display Medium;
    font-size: 12px;
    line-height: 150%;
    letter-spacing: 0%;
    text-align: center;
    margin-bottom: 0.9375rem;
  }

  #total-title {
    font-family: Noto Sans;
    font-weight: 700;
    font-style: Bold;
    font-size: 16px;
    line-height: 16px;
    letter-spacing: 0%;
    text-align: center;
    vertical-align: middle;
  }

  #total-amount {
    font-family: Noto Sans KR;
    font-weight: 700;
    font-style: Bold;
    font-size: 24px;
    line-height: 100%;
    letter-spacing: 0%;
    text-align: center;
    vertical-align: middle;
  }
`;

const ConfirmButton = styled.button`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 580px;
  height: 64px;
  background-color: #000000;
  color: #ffffff;
  border: none;
  cursor: pointer;

  font-family: Noto Sans;
  font-weight: 700;
  font-style: Bold;
  font-size: 16px;
  line-height: 16px;
  letter-spacing: 0%;
  text-align: center;
  vertical-align: middle;
`;
