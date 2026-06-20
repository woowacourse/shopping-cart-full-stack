import styled from "styled-components";
import { CartItem } from "../../type/types";
import { useNavigate } from "react-router-dom";
import { totalQuantity } from "../../util/getOrderPrice";
import { orderApi } from "../../api/orderApi";

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

  const handleClick = async () => {
    const checkedItems = cartItems
      .filter((item) => selectedItems.get(item.cartItemId) === true)
      .map(({ productData: { productId }, quantity }) => ({
        productId,
        quantity,
      }));
    const res = await orderApi.create({ items: checkedItems });
    const { orderId } = await res.json();
    const itemCount = [...selectedItems.values()].filter(
      (value) => value === true,
    ).length;

    navigate(`/order/${orderId}`);
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
  margin-top: auto;
  cursor: pointer;
`;
