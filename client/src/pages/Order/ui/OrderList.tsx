import Flex from '../../../shared/layout/Flex';
import List from '../../../shared/layout/List';
import OrderItem from '../../../entities/order/ui/OrderItem';
import type { OrderProduct } from '../../../entities/order/types';

type OrderListProps = {
  products: OrderProduct[];
};

export default function OrderList({ products }: OrderListProps) {
  return (
    <Flex as="section" direction="column" gap={20}>
      <List>
        {products.map((product) => (
          <OrderItem key={product.productId} product={product} />
        ))}
      </List>
    </Flex>
  );
}
