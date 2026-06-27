import type { CartItemResponse } from '../../../api/cart/cartApi.types';
import { ItemLayout } from '../../../shared/components/ItemLayout';
import { QuantityStepper } from './QuantityStepper';
import styled from 'styled-components';

type CartItemProps = {
  value: CartItemResponse;
  isSelected: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onDecrease: () => void;
  onIncrease: () => void;
};

export const CartItem = ({
  value,
  isSelected,
  onToggle,
  onDelete,
  onDecrease,
  onIncrease,
}: CartItemProps) => {
  return (
    <ItemLayout
      leadingSlot={
        <Checkbox type="checkbox" checked={isSelected} onChange={onToggle} />
      }
      image={<ItemLayout.Image src={value.imageUrl} alt={value.productName} />}
      name={<ItemLayout.Name>{value.productName}</ItemLayout.Name>}
      price={
        <ItemLayout.Price>
          {value.productPrice.toLocaleString()}원
        </ItemLayout.Price>
      }
      quantitySlot={
        <ItemLayout.Quantity>
          <QuantityStepper
            quantity={value.purchaseQuantity}
            isDecreaseDisabled={value.purchaseQuantity <= 1}
            isIncreaseDisabled={
              value.purchaseQuantity >= value.remainingQuantity ||
              value.purchaseQuantity >= 99
            }
            onDecrease={onDecrease}
            onIncrease={onIncrease}
          />
        </ItemLayout.Quantity>
      }
      trailingSlot={
        <DeleteButton type="button" onClick={onDelete}>
          삭제
        </DeleteButton>
      }
    />
  );
};

const Checkbox = styled.input`
  width: 22px;
  height: 22px;
  margin: 0;

  accent-color: #000000;
`;

const DeleteButton = styled.button`
  flex: none;
  padding: 4px 8px;
  border: 1px solid #dddddd;
  border-radius: 4px;

  background-color: #ffffff;
  color: #000000;

  font-size: 11px;
  font-weight: 600;
`;
