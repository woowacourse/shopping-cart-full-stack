import useOrderSummary from "../../../hooks/useOrderSummary";
import type { CartItemModel } from "../../../hooks/useCartItems.types";
import {
  Container,
  FreeShippingNotice,
  InfoIcon,
  PriceGroup,
  TotalSection,
} from "./OrderSummary.styles";
import CheckoutButton from "../CheckoutButton/CheckoutButton";
import SummaryRow from "../../../commons/SummaryRow/SummaryRow";

interface Props {
  items: CartItemModel[];
}

const OrderSummary = ({ items }: Props) => {
  const {
    itemCount,
    totalPrice,
    shippingFee,
    totalAmount,
    freeShippingThreshold,
  } = useOrderSummary(items);

  return (
    <Container>
      <FreeShippingNotice>
        <InfoIcon>i</InfoIcon>
        <p>
          총 주문 금액이 {freeShippingThreshold.toLocaleString()}원 이상일 경우
          무료 배송됩니다.
        </p>
      </FreeShippingNotice>
      <PriceGroup>
        <SummaryRow label="주문 금액" value={totalPrice} />
        <SummaryRow label="배송비" value={shippingFee} />
      </PriceGroup>
      <TotalSection>
        <SummaryRow label="총 결제 금액" value={totalAmount} />
      </TotalSection>
      <CheckoutButton itemCount={itemCount} />
    </Container>
  );
};

export default OrderSummary;
