import styled from "styled-components";
import type { CartItem } from "../../type/types";
import ShoppingCartItem from "./ShoppingCartItem";

interface Props {
  cartItems: CartItem[];
  selectedItems: Map<number, boolean>;
  onDelete: (cartItemId: number) => void;
  onToggle: (cartItemId: number) => void;
  onToggleAll: () => void;
  onQuantityChange: (cartItemId: number, quantity: number) => void;
}

export default function ShoppingCartList({
  cartItems,
  onDelete,
  onToggle,
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
          checked={
            cartItems.length > 0 &&
            [...selectedItems.values()].every((value) => value === true)
          }
        />
        전체선택
      </Label>

      {cartItems.map((cartItem) => {
        return (
          <ShoppingCartItem
            cartItem={cartItem}
            onDelete={onDelete}
            onToggle={onToggle}
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
  width: 100%;
  gap: 20px;
  flex: 1;
  margin-bottom: 52px;
  overflow-y: auto;
  overflow-x: hidden;
`;

const Label = styled.label`
  display: flex;
  flex-direction: row; // column → row
  align-items: center;
`;
