import Spacing from "@components/common/shared/Spacing";
import Text from "@components/common/shared/Text";

interface OrderAmountContentProps {
  totalAmount: number;
}

export default function OrderAmountContent({ totalAmount }: OrderAmountContentProps) {
  return (
    <>
      <Text typograph="body1" as="h3">
        총 결제 금액
      </Text>
      <Spacing size={0.75} />
      <Text typograph="heading1" as="p">
        {totalAmount.toLocaleString()}원
      </Text>
    </>
  );
}
