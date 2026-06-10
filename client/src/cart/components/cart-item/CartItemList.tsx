import styled from '@emotion/styled';

import {Checkbox} from '../../../design-system/index.js';
import {CartItemRow} from './CartItemRow.js';
import type {CartItem, CartItemId} from '../../domain/types.js';

type CartItemListProps = {
  items: CartItem[];
  selectedIds: CartItemId[];
  onChangeQuantity: (cartItemId: CartItemId, quantity: CartItem['quantity']) => void | Promise<void>;
  onChangeSelectedIds: (selectedIds: CartItemId[]) => void;
  onDelete: (cartItemId: CartItemId) => void | Promise<void>;
};

export const CartItemList = ({
  items,
  selectedIds,
  onChangeQuantity,
  onChangeSelectedIds,
  onDelete,
}: CartItemListProps) => {
  const cartItemIds = items.map((cartItem) => cartItem.id);
  const isAllSelected = items.length > 0 && cartItemIds.every((cartItemId) => selectedIds.includes(cartItemId));

  const handleToggleAll = () => {
    const nextSelectedIds = isAllSelected ? [] : cartItemIds;

    onChangeSelectedIds(nextSelectedIds);
  };

  const handleToggleItem = (cartItemId: CartItemId) => {
    const isSelected = selectedIds.includes(cartItemId);
    const nextSelectedIds = isSelected
      ? selectedIds.filter((selectedId) => selectedId !== cartItemId)
      : [...selectedIds, cartItemId];

    onChangeSelectedIds(nextSelectedIds);
  };

  const handleDelete = (cartItemId: CartItemId) => {
    const isDeleteConfirmed = window.confirm('상품을 삭제하시겠습니까?');

    if (!isDeleteConfirmed) return;

    void onDelete(cartItemId);
  };

  return (
    <>
      <SelectAllArea>
        <Checkbox checked={isAllSelected} label='전체 선택' onChange={handleToggleAll} />
      </SelectAllArea>
      <ItemListArea>
        {items.map((cartItem) => (
          <CartItemRow
            key={cartItem.id}
            cartItem={cartItem}
            checked={selectedIds.includes(cartItem.id)}
            onChangeQuantity={onChangeQuantity}
            onDelete={handleDelete}
            onToggle={handleToggleItem}
          />
        ))}
      </ItemListArea>
    </>
  );
};

const SelectAllArea = styled.div`
  margin-top: 36px;
`;

const ItemListArea = styled.div`
  margin-top: 20px;
`;
