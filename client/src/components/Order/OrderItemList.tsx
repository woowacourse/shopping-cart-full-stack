import styled from '@emotion/styled';
import ProductCard from '../Product/ProductCard';
import type { Order } from '../../types/order.types';

interface Props {
  orders: Order[];
}

export default function OrderItemList({ orders }: Props) {
  return (
    <Container>
      {orders.map((order) => (
        <ProductCard
          key={order.id}
          data={order}
          quantitySlot={<Quantity>{order.orderCount}개</Quantity>}
        />
      ))}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 32px;
`;

const Quantity = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #0a0d13;
`;
