import info from "@assets/info.svg";
import OrderSummaryRow from "@components/common/entities/OrderSummaryRow";
import Text from "@components/common/shared/Text";
import Spacing from "@components/common/shared/Spacing";
import Divider from "@components/common/shared/Divider";
import Flex from "@components/common/shared/Flex";
import styled from "@emotion/styled";
import useOrderQuery from "@/hooks/useOrderQuery";
import useOrderDiscountQuery from "@/hooks/useOrderDiscountQuery";

interface OrderSummarySectionProps {
  orderId: number;
}

export default function OrderSummarySection({ orderId }: OrderSummarySectionProps) {
  const { data: order } = useOrderQuery(orderId);
  const { data: discount } = useOrderDiscountQuery(orderId, { couponId: order.coupons ?? [] });

  const totalOrderAmount = order.products.reduce((acc, p) => acc + p.price * p.quantity, 0);
  const discountAmount = discount.discountAmount;
  const deliveryFee = order.deliveryFee ?? 0;

  const totalPaymentAmount = totalOrderAmount - discountAmount + deliveryFee;

  return (
    <OrderSummarySectionContainer data-testid="order-summary">
      <Flex gap={4}>
        <InfoIcon src={info} alt="정보" />
        <Text typograph="caption" as="span">
          총 주문 금액이 100,000원 이상일 경우 무료 배송됩니다.
        </Text>
      </Flex>

      <Spacing size={0.75} />
      <Divider />
      <Spacing size={0.75} />

      <OrderSummaryRow label="총 주문 금액" value={totalOrderAmount} />
      <Spacing size={0.5} />
      <OrderSummaryRow label="쿠폰 할인 금액" value={discountAmount === 0 ? discountAmount : -discountAmount} />
      <Spacing size={0.5} />
      <OrderSummaryRow label="배송비" value={deliveryFee} />

      <Spacing size={0.75} />
      <Divider />
      <Spacing size={0.75} />

      <OrderSummaryRow label="총 결제 금액" value={totalPaymentAmount} />
    </OrderSummarySectionContainer>
  );
}

const OrderSummarySectionContainer = styled.div``;

const InfoIcon = styled.img`
  width: 0.875rem;
  aspect-ratio: 1/1;
`;
