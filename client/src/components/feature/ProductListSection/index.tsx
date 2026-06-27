import Divider from "@components/common/shared/Divider";
import Flex from "@components/common/shared/Flex";
import Spacing from "@components/common/shared/Spacing";
import styled from "@emotion/styled";
import OrderItem from "@components/common/entities/OrderItem";
import useOrderQuery from "@/hooks/useOrderQuery";

interface ProductListSectionProps {
  orderId: number;
}

export default function ProductListSection({ orderId }: ProductListSectionProps) {
  const { data: order } = useOrderQuery(orderId);

  return (
    <OrderList as="ul" direction="column" gap={20} aria-label="상품 리스트">
      {order.products.map((item) => (
        <OrderItemWrapper>
          <Divider />
          <Spacing size={0.75} />
          <OrderItem key={item.id} {...item} />
        </OrderItemWrapper>
      ))}
    </OrderList>
  );
}

const OrderList = styled(Flex)``;

const OrderItemWrapper = styled.li``;
