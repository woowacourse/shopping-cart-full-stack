import { css } from "@emotion/react";
import { Navigate, useLocation, useNavigate } from "react-router";
import { ROUTES } from "../constants/routes";
import Header from "../components/Header";
import type { PaymentSummary } from "../domain/checkout";
import Button from "../components/Button";
import { formatPrice } from "../utils/format";

export default function OrderSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const paymentSummary = location.state as PaymentSummary | null;

  if (!paymentSummary) {
    return <Navigate to={ROUTES.CART} replace />;
  }

  const handleNavigateToCart = () => {
    navigate(ROUTES.CART, { replace: true });
  };

  return (
    <div css={pageStyle}>
      <Header>
        <Header.BackButton />
      </Header>
      <main css={mainStyle}>
        <h1 className="typo-xl-b">결제 확인</h1>
        <p className="typo-sm-r">
          총 {paymentSummary.itemCount}종류의 상품 {paymentSummary.totalQuantity}개를 주문했습니다.
          <br />
          최종 결제 금액을 확인해 주세요.
        </p>
        <div css={totalGroupStyle}>
          <p className="typo-md-b">총 결제 금액</p>
          <p className="typo-xl-b">{formatPrice(paymentSummary.totalAmount)}</p>
        </div>
      </main>
      <footer css={footerStyle}>
        <Button onClick={handleNavigateToCart}>
          <span className="typo-md-b">장바구니로 돌아가기</span>
        </Button>
      </footer>
    </div>
  );
}

const pageStyle = css`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const mainStyle = css`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 32px 24px;
  gap: 24px;
  text-align: center;
`;

const totalGroupStyle = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
`;

const footerStyle = css`
  flex-shrink: 0;
  height: 56px;
`;
