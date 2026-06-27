import Flex from "@components/common/shared/Flex";
import Text from "@components/common/shared/Text";

import useOrderQuery from "@/hooks/useOrderQuery";

interface OrderFormHeadingProps {
  orderId: number;
}

export default function OrderFormHeading({ orderId }: OrderFormHeadingProps) {
  const { data: order } = useOrderQuery(orderId);

  const productCount = order.products.length;
  const totalQuantity = order.products.reduce((acc, p) => acc + p.quantity, 0);

  return (
    <Flex direction="column" gap={12}>
      <Text typograph="heading1" as="h2">
        주문 확인
      </Text>
      <Text typograph="caption" as="p">
        총 {productCount}종류의 상품 {totalQuantity}개를 주문합니다.
        <br />
        최종 결제 금액을 확인해 주세요.
      </Text>
    </Flex>
  );
}
