import styled from "styled-components";
import { QUANTITY_CONSTANTS } from "../../constants/constants";

interface Props {
  cartItemId: number;
  quantity: number;
  onQuantityChange: (cartItemId: number, quantity: number) => void;
}

export default function QuantityControl({
  cartItemId,
  quantity,
  onQuantityChange,
}: Props) {
  return (
    <Container>
      <MinusButton
        onClick={() => {
          quantity > QUANTITY_CONSTANTS.MIN_QUANTITY &&
            onQuantityChange(cartItemId, quantity - 1);
        }}
      >
        -
      </MinusButton>
      <Input type="number" value={quantity} />
      <PlusButton
        onClick={() => {
          quantity < QUANTITY_CONSTANTS.MAX_QUANTITY &&
            onQuantityChange(cartItemId, quantity + 1);
        }}
      >
        +
      </PlusButton>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5px;
`;

const MinusButton = styled.button`
  width: 24px;
  height: 24px;
  background-color: #ffffff;
  border-width: 1px;
  border-color: #ffffff;
  border-radius: 8px;
`;
const Input = styled.input`
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  width: 24px;
  height: 15px;
  border: none;
  margin: none;
`;
const PlusButton = styled.button`
  width: 24px;
  height: 24px;
  background-color: #ffffff;
  border-width: 1px;
  border-color: #ffffff;
  border-radius: 8px;
  margin: none;
`;
