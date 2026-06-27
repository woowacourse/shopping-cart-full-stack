import Spacing from "@components/common/shared/Spacing";
import Text from "@components/common/shared/Text";

interface OrderConfirmContentProps {
  productCount: number;
  totalQuantity: number;
}

export default function OrderConfirmContent({ productCount, totalQuantity }: OrderConfirmContentProps) {
  return (
    <>
      <Text typograph="heading1" as="h2">
        주문 확인
      </Text>
      <Spacing size={1.5} />
      <Text typograph="caption" as="p">
        총 {productCount}종류의 상품 {totalQuantity}개를 주문합니다.
      </Text>
      <Text typograph="caption" as="p">
        최종 결제 금액을 확인해 주세요.
      </Text>
    </>
  );
}
