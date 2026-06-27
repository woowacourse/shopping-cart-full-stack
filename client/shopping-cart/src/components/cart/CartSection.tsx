import { css } from '@emotion/react';
import type { CartItem } from '../../types';
import CheckboxLabel from '../common/buttons/CheckboxLabel';
import CartItemList from './CartItemList';

type Props = {
  cartItems: CartItem[];
  isAllSelect: boolean;
  onSelectAll: (nextIsAllSelected: boolean) => void;
  onSelect: (id: string, nextCheckStatus: boolean) => void;
  onChangeQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  onDelete: (cartItemId: string) => Promise<void>;
};

const CartSection = ({
  cartItems,
  isAllSelect,
  onSelectAll,
  onSelect,
  onChangeQuantity,
  onDelete,
}: Props) => {
  return (
    <section
      css={css`
        display: flex;
        flex-direction: column;
        gap: 20px;
      `}
    >
      <CheckboxLabel
        isSelected={isAllSelect}
        onToggle={() => onSelectAll(!isAllSelect)}
        label="전체 선택"
      />

      <CartItemList
        cartItems={cartItems}
        handleSelect={onSelect}
        onChangeQuantity={onChangeQuantity}
        onDelete={onDelete}
      />
    </section>
  );
};

export default CartSection;
