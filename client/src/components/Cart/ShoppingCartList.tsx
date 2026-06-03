import styled from "styled-components";
import CartItem from "./CartItem";

interface Props {
  cartItems: CartItems[];
}

export default function ShoppingCartList({ cartItems }): Props {
  return (
    <Container>
      <input type="checkbox">전체선택</input>
      {cartItems.map((cartItem) => {
        <CartItem />;
      })}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  width: 382px;
  height: 384px;
`;
