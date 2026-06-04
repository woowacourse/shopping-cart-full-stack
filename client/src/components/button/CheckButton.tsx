import styled from "styled-components";
import { CartItem } from "../../type/types";
import { useNavigate } from "react-router-dom";

interface Props {
  cartItems: CartItem[];
  selectedItems: Map<number, boolean>;
  totalPrice: number;
}

export default function CheckButton({
  cartItems,
  selectedItems,
  totalPrice,
}: Props) {
  const navigate = useNavigate();

  const isDisabled =
    cartItems.length === 0 ||
    [...selectedItems.values()].every((value) => value === false);

  const handleClick = () => {
    const itemCount = [...selectedItems.values()].filter(
      (value) => value === true,
    ).length;

    const totalQuantity = cartItems
      .filter((cartItem) => selectedItems.get(cartItem.cartItemId))
      .reduce((acc, cartItem) => acc + cartItem.quantity, 0);

    navigate("/order-confirm", {
      state: { itemCount, totalQuantity, totalPrice },
    });
  };
  return (
    <Button disabled={isDisabled} onClick={handleClick}>
      주문 확인
    </Button>
  );
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
