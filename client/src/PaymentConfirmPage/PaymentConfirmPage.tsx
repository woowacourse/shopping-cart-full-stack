import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../common/Button";

export function PaymentConfirmPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const finalAmount = state?.finalAmount as number;
  const typeCount = state?.typeCount as number;
  const totalQuantity = state?.totalQuantity as number;

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontWeight: 700, fontSize: "24px", marginBottom: "27px" }}>
          결제 확인
        </h2>
        <p style={{ fontSize: "14px" }}>
          총 {typeCount}종류의 상품 {totalQuantity}개를 주문했습니다.
          <br />
          최종 결제 금액을 확인해 주세요.
        </p>
        <p style={{ fontWeight: 700, fontSize: "16px", marginTop: "24px" }}>
          총 결제 금액
        </p>
        <p style={{ fontWeight: 700, fontSize: "24px" }}>
          {finalAmount?.toLocaleString()}원
        </p>
      </div>
      <Button label="장바구니로 돌아가기" onClick={() => navigate("/cart")} />
    </div>
  );
}
