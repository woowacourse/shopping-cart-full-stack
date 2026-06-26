import styled from '@emotion/styled';

interface OrderItemProps {
  quantity: number;
  name: string;
  thumbnail: string;
  price: number;
}

const OrderItem = ({ name, thumbnail, price, quantity }: OrderItemProps) => {
  return (
    <Content>
      <Thumbnail src={thumbnail} alt={name} />

      <ProductInfo>
        <Name>{name}</Name>
        <Price>{price.toLocaleString()}원</Price>

        <Quantity>{quantity}개</Quantity>
      </ProductInfo>
    </Content>
  );
};

const Content = styled.article`
  display: flex;
  gap: 1.4rem;
  padding-block: 0.75rem;
  border-top: 1px solid #0000001a;
`;

const Thumbnail = styled.img`
  width: 7rem;
  height: 7rem;
  border-radius: 0.5rem;
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Name = styled.p`
  margin: 0;
  font-size: 0.75rem;
  font-weight: 500;
`;

const Price = styled.strong`
  margin-top: 0.25rem;
  font-size: 1.5rem;
  font-weight: 700;
`;

const Quantity = styled.div`
  margin: 0.75rem 0 0;
  font-size: 0.75rem;
  font-weight: 500;
`;

export default OrderItem;
