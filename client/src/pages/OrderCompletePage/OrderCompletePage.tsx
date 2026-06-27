import { useLocation } from "react-router";
import Price from "../../commons/Price/Price";
import {
  Container,
  Content,
  Description,
  PaymentAmount,
  PaymentSummary,
  Title,
} from "./OrderCompletePage.styles";
import BackToCartButton from "../../components/BackToCartButton/BackToCartButton";

interface CheckoutLocationState {
  itemCount: number;
  totalQuantity: number;
  totalAmount: number;
}

const OrderCompletePage = () => {
  const { state } = useLocation();
  const { itemCount, totalQuantity, totalAmount }: CheckoutLocationState =
    state;

  return (
    <Container>
      <Content>
        <Title>주문 확인</Title>
        <Description>
          <p>
            총 {itemCount}종류의 상품 {totalQuantity}개 주문합니다.
          </p>
          <p>최종 결제 금액을 확인해 주세요.</p>
        </Description>
        <PaymentSummary>
          <p>총 결제 금액</p>
          <PaymentAmount>
            <Price value={totalAmount} />
          </PaymentAmount>
        </PaymentSummary>
      </Content>
      <BackToCartButton />
    </Container>
  );
};

export default OrderCompletePage;
