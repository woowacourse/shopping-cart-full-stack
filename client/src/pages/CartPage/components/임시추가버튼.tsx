import styled from "@emotion/styled";
import { addCartItem } from "../../../domain/cart/cart.api";

const 임시추가버튼 = () => {
  const handleClick = async () => {
    try {
      await addCartItem(1, 1, 10);
      await addCartItem(1, 2, 5);
      await addCartItem(1, 3, 1);
    } finally {
      window.location.reload();
    }
  };

  return (
    <Button type="button" onClick={handleClick}>
      장바구니에 상품추가(임시)
    </Button>
  );
};

export default 임시추가버튼;

const Button = styled.button`
  margin-left: 12px;
  padding: 4px 8px;
  border: 1px solid black;
  border-radius: 4px;
  background-color: white;
  font-weight: 700;
  font-size: 12px;
  cursor: pointer;
`;
