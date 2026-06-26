import styled from '@emotion/styled';
import { formatPrice } from '../../utils/formatPrice';
import type { ReactNode } from 'react';
import type { ProductBase } from '../../types/product.types';

interface Props {
  data: ProductBase;
  quantitySlot: ReactNode;
}

export default function ProductCard({ data, quantitySlot }: Props) {
  return (
    <Card>
      <ImgWrapper>
        <img src={data.imgUrl} alt={`${data.name}-image`} />
      </ImgWrapper>

      <Body>
        <Content>
          <Name>{data.name}</Name>
          <Price>{formatPrice(data.price)}원</Price>
        </Content>

        {quantitySlot}
      </Body>
    </Card>
  );
}

const Card = styled.li`
  display: flex;
  align-items: center;
  gap: 24px;
  width: 100%;
`;

const ImgWrapper = styled.div`
  display: flex;
  justify-conent: center;
  align-items: center;
  width: 112px;
  height: 112px;
  object-fit: cover;
  border-radius: 8px;
  overflow: hidden;

  img {
    display: block;
    width: 100%;
    height: auto;
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 100%;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Name = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: #0a0d13;
`;

const Price = styled.strong`
  font-size: 24px;
  font-weight: 700;
  color: #000;
`;
