import Divider from "@components/common/shared/Divider";
import info from "@assets/info.svg";
import Spacing from "@components/common/shared/Spacing";
import Text from "@components/common/shared/Text";
import Flex from "@components/common/shared/Flex";
import OrderSummaryRow from "@components/common/entities/OrderSummaryRow";
import styled from "@emotion/styled";

interface CartOrderAmountProps {
  orderAmount: number;
  deliveryFee: number;
  totalAmount: number;
}

export default function CartOrderAmount({ orderAmount, deliveryFee, totalAmount }: CartOrderAmountProps) {
  return (
    <CartOrderAmountContainer>
      <Flex gap={4} align="center">
        <InfoIcon src={info} alt="정보" />
        <Text typograph="caption" as="span">
          총 주문 금액이 100,000원 이상일 경우 무료 배송됩니다.
        </Text>
      </Flex>

      <Spacing size={0.75} />
      <Divider />
      <Spacing size={0.75} />

      <OrderSummaryRow label="총 주문 금액" value={orderAmount} />
      <Spacing size={0.5} />
      <OrderSummaryRow label="배송비" value={deliveryFee} />

      <Spacing size={0.75} />
      <Divider />
      <Spacing size={0.75} />

      <OrderSummaryRow label="총 결제 금액" value={totalAmount} />
    </CartOrderAmountContainer>
  );
}

const CartOrderAmountContainer = styled.div``;

const InfoIcon = styled.img`
  width: 0.875rem;
  aspect-ratio: 1/1;
`;
