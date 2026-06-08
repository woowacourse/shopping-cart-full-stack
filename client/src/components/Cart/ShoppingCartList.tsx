import styled from "styled-components";
import type { CartItem } from "../../type/types";
import ShoppingCartItem from "./ShoppingCartItem";

interface Props {
  cartItems: CartItem[];
  selectedItems: Map<number, boolean>;
  onDelete: (cartItemId: number) => void;
  onTogle: (cartItemId: number) => void;
  onToggleAll: () => void;
  onQuantityChange: (cartItemId: number, quantity: number) => void;
}

export default function ShoppingCartList({
  cartItems,
  onDelete,
  onTogle,
  onToggleAll,
  selectedItems,
  onQuantityChange,
}: Props) {
  return (
    <Container>
      <Label>
        <input
          type="checkbox"
          onChange={() => {
            onToggleAll();
          }}
          checked={[...selectedItems.values()].every((value) => value === true)}
        />
        전체선택
      </Label>

      {cartItems.map((cartItem) => {
        return (
          <ShoppingCartItem
            cartItem={cartItem}
            onDelete={onDelete}
            onTogle={onTogle}
            isSelected={selectedItems.get(cartItem.cartItemId) ?? false}
            onQuantityChange={onQuantityChange}
          />
        );
      })}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column; // 추가
  width: 382px;
  gap: 20px;
`;

const Label = styled.label`
  display: flex;
  flex-direction: row; // column → row
  align-items: center;
`;
