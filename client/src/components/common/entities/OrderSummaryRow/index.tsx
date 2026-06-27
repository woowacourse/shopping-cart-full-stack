import Flex from "@components/common/shared/Flex";
import Text from "@components/common/shared/Text";
import styled from "@emotion/styled";

interface OrderSummaryRowProps {
  label: string;
  value: number;
}

export default function OrderSummaryRow({ label, value }: OrderSummaryRowProps) {
  return (
    <OrderSummaryRowContainer>
      <Flex justify="space-between" align="center">
        <Text typograph="body1" as="span">
          {label}
        </Text>
        <Text typograph="heading1" as="span">
          {value.toLocaleString()}원
        </Text>
      </Flex>
    </OrderSummaryRowContainer>
  );
}

const OrderSummaryRowContainer = styled.div`
  padding-block: 0.5rem;
`;
