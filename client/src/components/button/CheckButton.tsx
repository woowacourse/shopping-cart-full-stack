import styled from "styled-components";
import { CartItem } from "../../type/types";

interface Props {
  cartItems: CartItem[];
  selectedItems: Map<number, boolean>;
}

export default function CheckButton({ cartItems, selectedItems }: Props) {
  const isDisabled =
    cartItems.length === 0 ||
    [...selectedItems.values()].every((value) => value === false);
  return <Button disabled={isDisabled}>주문 확인</Button>;
}
const Button = styled.button<{ disabled?: boolean }>`
  width: 100%;
  height: 64px;
  font-size: 16px;
  font-weight: 700;
  font-family: sans-serif;
  color: #ffffff;
  background-color: ${({ disabled }) => (disabled ? "#BEBEBE" : "#000000")};
  cursor: pointer;
`;
