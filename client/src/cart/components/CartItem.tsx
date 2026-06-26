import styled from '@emotion/styled';
import type { ReactNode } from 'react';

interface CartItemProps {
  children: ReactNode;
  name: string;
  thumbnail: string;
  price: number;
}

const CartItem = ({ children, name, thumbnail, price }: CartItemProps) => {
  return (
    <Content>
      <Thumbnail src={thumbnail} alt={name} />

      <ProductInfo>
        <Name>{name}</Name>
        <Price>{price.toLocaleString()}원</Price>

        <QuantityArea>{children}</QuantityArea>
      </ProductInfo>
    </Content>
  );
};

const Content = styled.div`
  display: flex;
  gap: 1.4rem;
  margin-top: 0.75rem;
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

const QuantityArea = styled.div`
  margin-top: 0.75rem;
`;

export default CartItem;
