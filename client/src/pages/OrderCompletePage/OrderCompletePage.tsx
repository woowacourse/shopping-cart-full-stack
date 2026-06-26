import BaseButton from "../../shared/components/BaseButton";
import Header from "../../shared/components/Header";
import styled from "@emotion/styled";
import { useLocation, useNavigate } from "react-router-dom";
import { formatPrice } from "../../shared/utils";
import { typography } from "../../shared/styles/typography";
import type { CheckoutItem } from "../../domain/checkout/checkout.api";
import { getCheckoutAllItemCount } from "../../domain/checkout/checkout.util";

const OrderCompletePage = () => {
  const navigate = useNavigate();
  const {
    checkoutItems,
    totalPrice,
  }: {
    checkoutItems: CheckoutItem[];
    totalPrice: number;
  } = useLocation().state;

  return (
    <OrderCompletePageLayout>
      <Header actionIcon={<></>} />
      <OrderConfirmContent>
        <OrderConfirmTitle>결제 확인</OrderConfirmTitle>
        <OrderConfirmDescription>
          총 {checkoutItems.length}종류의 상품
          {getCheckoutAllItemCount(checkoutItems)}개를 주문했습니다.
          <br />
          최종 결제 금액을 확인해 주세요.
        </OrderConfirmDescription>
        <TotalPriceLabel>총 결제 금액</TotalPriceLabel>
        <TotalPrice>{formatPrice(totalPrice)}원</TotalPrice>
      </OrderConfirmContent>
      <BaseButton
        onClick={() => navigate("/cart")}
        style={"black"}
        display="full"
        rounded="none"
      >
        장바구니로 돌아가기
      </BaseButton>
    </OrderCompletePageLayout>
  );
};

export default OrderCompletePage;

const OrderCompletePageLayout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const OrderConfirmContent = styled.main`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px;
  text-align: center;
`;

const OrderConfirmTitle = styled.h1`
  ${typography.titleLarge}
  margin-bottom: 28px;
`;

const OrderConfirmDescription = styled.p`
  ${typography.bodySmall}
  margin-bottom: 32px;
  line-height: 1.5;
`;

const TotalPriceLabel = styled.div`
  ${typography.titleMedium}
  margin-bottom: 12px;
`;

const TotalPrice = styled.div`
  ${typography.titleLarge}
`;
