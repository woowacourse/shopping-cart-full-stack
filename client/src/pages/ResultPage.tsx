import { useLocation, Navigate, useNavigate } from "react-router";
import type { CartItem, Gift } from "../entites/checkout/model";
import styles from "./ResultPage.module.css";

export const ResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const stateData = location.state as {
    items: CartItem[];
    gifts: Gift[];
    totalPrice: number;
  } | null;

  if (!stateData) {
    return <Navigate to="/" replace />;
  }

  const { items, gifts, totalPrice } = stateData;
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalGiftCount = gifts ? gifts.reduce((sum, gift) => sum + gift.quantity, 0) : 0;

  const handleSubmit = () => {
    navigate("/cart");
  };

  return (
    <div className={styles.container}>
      <div className={styles.topBar} />
      <div className={styles.content}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>결제 확인</h1>
          <p className={styles.subtitle}>
            총 {items.length}종류의 상품 {totalItemCount}개
            {totalGiftCount > 0 ? ` (+사은품 ${totalGiftCount}개)` : ""}를 주문했습니다.
            <br />
            최종 결제 금액을 확인해 주세요.
          </p>
        </div>

        <div className={styles.priceSection}>
          <h2 className={styles.priceLabel}>총 결제 금액</h2>
          <div className={styles.priceValue}>{totalPrice.toLocaleString()}원</div>
        </div>
      </div>
      <div className={styles.footer}>
        <button className={styles.returnBtn} onClick={handleSubmit}>
          장바구니로 돌아가기
        </button>
      </div>
    </div>
  );
};
