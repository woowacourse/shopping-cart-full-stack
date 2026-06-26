import Spacing from "@components/common/shared/layout/Spacing";
import OrderAmountContent from "@components/common/shared/ui/OrderAmountContent";
import styled from "@emotion/styled";
import usePaymentNavigate from "@/hooks/feature/navigate/usePaymentNavigate";

function calcTotalQuantity(products: { quantity: number }[]) {
  return products.reduce((acc, product) => acc + product.quantity, 0);
}

export default function PaymentConfirmSection() {
  const { getState } = usePaymentNavigate();
  const state = getState();

  if (!state) {
    return (
      <ContentContainer>
        <p>잘못된 접근입니다.</p>
      </ContentContainer>
    );
  }

  const { products, totalAmount } = state;

  return (
    <ContentContainer>
      <OrderConfirmHeading>결제 확인</OrderConfirmHeading>
      <Spacing size={1.5} />
      <OrderConfirmDescription>
        총 {products.length}종류의 상품 {calcTotalQuantity(products)}개를
        주문했습니다.
      </OrderConfirmDescription>
      <OrderConfirmDescription>
        최종 결제 금액을 확인해 주세요.
      </OrderConfirmDescription>
      <Spacing size={1.5} />
      <OrderAmountContent totalAmount={totalAmount} />
    </ContentContainer>
  );
}

const ContentContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const OrderConfirmHeading = styled.h2`
  font-weight: 700;
  font-size: 24px;
  line-height: 100%;
`;

const OrderConfirmDescription = styled.p`
  font-weight: 500;
  font-size: 12px;
  line-height: 150%;
`;
