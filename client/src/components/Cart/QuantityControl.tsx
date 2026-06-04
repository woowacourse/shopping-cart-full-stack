import { ChangeEvent, useState } from "react";
import styled from "styled-components";

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
  const [controlQuantity, setContorlQuantity] = useState(quantity);

  return (
    <Container>
      <MinusButton
        onClick={() => {
          if (controlQuantity > 1) {
            const newQuantity = controlQuantity - 1;
            setContorlQuantity(newQuantity);
            onQuantityChange(cartItemId, newQuantity);
          } else return;
        }}
      >
        -
      </MinusButton>
      <Input type="number" value={controlQuantity} />
      <PlusButton
        onClick={() => {
          if (controlQuantity < 99) {
            const newQuantity = controlQuantity + 1;
            setContorlQuantity(newQuantity);
            onQuantityChange(cartItemId, newQuantity);
          } else return;
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
