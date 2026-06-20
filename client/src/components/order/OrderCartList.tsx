import styled from "styled-components";
import { OrderItem } from "../../type/types";
import OrderCartItem from "./OrderCartItem";

interface Props {
  items: OrderItem[];
}
export default function OrderCartList({ items }: Props) {
  //cartList에서 isSelect인 애들만 끌고옴
  // 뭘 끌고 오냐 써네일, 이름, 가격, 수량
  // 수량 버튼 빼고는 cartItem 컴포넌트와 똑같이 생김
  return (
    <Container>
      {items.map((item) => {
        return <OrderCartItem key={item.productId} item={item} />;
      })}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
  flex: 1;
  margin-bottom: 52px;
  overflow-y: auto;
  overflow-x: hidden;
`;
