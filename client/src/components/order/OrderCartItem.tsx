import styled from "styled-components";
import type { OrderItem } from "../../type/types";

interface Props {
  item: OrderItem;
}

export default function OrderCartItem({ item }: Props) {
  const { productData, quantity } = item;
  return (
    <div>
      <Container>
        <ItemContainer>
          <img width={112} height={112} src={productData.thumbnailUrl} />
          <ItemInfoContainer>
            <Name>{productData.name}</Name>
            <Price>{productData.price.toLocaleString()}원</Price>
            <Quantity>수량 {quantity}</Quantity>
          </ItemInfoContainer>
        </ItemContainer>
      </Container>
    </div>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-top: solid 1px #0000001a;
`;

const ItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;
const ItemInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 24px;
`;

const Name = styled.p``;

const Price = styled.p``;

const Quantity = styled.p``;
