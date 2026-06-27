import styled from 'styled-components';
import type { ReactNode } from 'react';

type ProductItemProps = {
  leadingSlot?: ReactNode;
  image: ReactNode;
  name: ReactNode;
  price: ReactNode;
  quantitySlot: ReactNode;
  trailingSlot?: ReactNode;
};

export const ItemLayout = ({
  leadingSlot,
  image,
  name,
  price,
  quantitySlot,
  trailingSlot,
}: ProductItemProps) => {
  return (
    <Container>
      {leadingSlot}

      <ItemContent>
        {image}
        <Content>
          {name}
          {price}
          {quantitySlot}
        </Content>
      </ItemContent>

      {trailingSlot}
    </Container>
  );
};

// 상품 한 칸의 레이아웃을 구성
const Container = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 12px 0;
  min-width: 0;

  border-top: 1px solid #eeeeee;
`;

const ItemContent = styled.div`
  display: flex;
  flex: 1;
  gap: 16px;
  min-width: 0;
`;

ItemLayout.Image = styled.img`
  flex: 0 0 auto;

  width: 98px;
  height: 98px;
  border-radius: 6px;

  object-fit: cover;
  background-color: #f2f2f2;
`;

const Content = styled.div`
  flex: 1;
  min-width: 0;
`;

ItemLayout.Name = styled.div`
  overflow: hidden;

  color: #000000;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

ItemLayout.Price = styled.div`
  color: #000000;
  font-size: 25px;
  font-weight: 700;
  line-height: 1.1;

  margin-bottom: 20px;
`;

ItemLayout.Quantity = styled.span`
  overflow: hidden;

  color: #000000;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
