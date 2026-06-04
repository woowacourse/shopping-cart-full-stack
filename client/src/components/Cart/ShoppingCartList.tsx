import styled from "styled-components";
import type { CartItem } from "../../type/types";
import ShoppingCartItem from "./ShoppingCartItem";

interface Props {
  cartItems: CartItem[];
  selectedItems: Map<number, boolean>;
  onDelete: (cartItemId: number) => void;
  onTogle: (cartItemId: number) => void;
  onTogleAll: () => void;
}

export default function ShoppingCartList({
  cartItems,
  onDelete,
  onTogle,
  onTogleAll,
  selectedItems,
}: Props) {
  return (
    <Container>
      <label>
        <input
          type="checkbox"
          onChange={() => {
            onTogleAll();
          }}
          checked={[...selectedItems.values()].every((value) => value === true)}
        />
        전체선택
      </label>

      {cartItems.map((cartItem) => {
        return (
          <ShoppingCartItem
            cartItem={cartItem}
            onDelete={onDelete}
            onTogle={onTogle}
            selectedItems={selectedItems}
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
