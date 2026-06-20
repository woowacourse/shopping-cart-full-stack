import styled from "styled-components";
import { OrderData } from "../../type/types";

interface Props {
  orderDatas: OrderData[];
}

export default function OrderCartList({ orderDatas }: Props) {
  //cartList에서 isSelect인 애들만 끌고옴
  // 뭘 끌고 오냐 써네일, 이름, 가격, 수량
  // 수량 버튼 빼고는 cartItem 컴포넌트와 똑같이 생김
  return (
    <Container>
      {orderDatas.map((orderData) => {
        return <OrderCartItem orderItem={orderData} />;
      })}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column; // 추가
  width: 100%;
  gap: 20px;
  flex: 1;
  margin-bottom: 52px;
  overflow-y: auto;
  overflow-x: hidden;
`;
