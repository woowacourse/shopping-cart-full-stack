import styled from "styled-components";
import type { CartItem } from "../../type/types";
import ShoppingCartItem from "./ShoppingCartItem";

interface Props {
  cartItems: CartItem[];
  onDelete: (cartItemId: number) => void;
  onTogle: (cartItemId: number) => void;
}

export default function ShoppingCartList({
  cartItems,
  onDelete,
  onTogle,
}: Props) {
  return (
    <Container>
      <input type="checkbox" onChange={() => {}}>
        전체선택
      </input>
      {cartItems.map((cartItem) => {
        return (
          <ShoppingCartItem
            cartItem={cartItem}
            onDelete={onDelete}
            onTogle={onTogle}
          />
        );
      })}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  width: 382px;
  height: 384px;
`;
