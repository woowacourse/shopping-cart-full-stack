import styled from "styled-components";
import type { CartItem } from "../../type/types";
import ShoppingCartItem from "./ShoppingCartItem";

interface Props {
  cartItems: CartItem[];
  onDelete: (cartItemId: number) => void;
}

export default function ShoppingCartList({ cartItems, onDelete }: Props) {
  return (
    <Container>
      <input type="checkbox">전체선택</input>
      {cartItems.map((cartItem) => {
        return <ShoppingCartItem cartItem={cartItem} onDelete={onDelete} />;
      })}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  width: 382px;
  height: 384px;
`;
