import { css } from "@emotion/react";
import { CART_ITEM_STATUS } from "../../domain/cart";
import { calculateShippingFee } from "../../domain/shipping";
import type { CartItemView } from "../../hooks/useCartList";
import CartOrderSummary from "../CartOrderSummary";
import Checkbox from "../Checkbox";
import CartListItem from "../CartListItem";

interface CartListProps {
  cartList: CartItemView[];
  isAllSelected: boolean;
  onSelectItem: (id: number) => void;
  onSelectAllItems: () => void;
}

export default function CartList({ cartList, isAllSelected, onSelectItem, onSelectAllItems }: CartListProps) {
  const { orderAmount, shippingFee, totalAmount } = getCartSummary(cartList);

  return (
    <div css={containerStyle}>
      <div css={captionStyle}>
        <p className="typo-sm-r">현재 {cartList.length}종류의 상품이 담겨있습니다.</p>
      </div>
      <div css={selectAllRowStyle}>
        <Checkbox checked={isAllSelected} onChange={onSelectAllItems}>
          <span className="typo-sm-r">전체선택</span>
        </Checkbox>
      </div>
      <div css={scrollableStyle}>
        <ul css={itemListStyle}>
          {cartList.map((cartItem) => (
            <li key={cartItem.id}>
              <CartListItem cartItem={cartItem} onSelect={onSelectItem} />
            </li>
          ))}
        </ul>
        <CartOrderSummary orderAmount={orderAmount} shippingFee={shippingFee} totalAmount={totalAmount} />
      </div>
    </div>
  );
}

function getCartSummary(cartList: CartItemView[]) {
  const selectedCartItems = cartList.filter((item) => item.isSelected && item.status === CART_ITEM_STATUS.AVAILABLE);
  const orderAmount = selectedCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = calculateShippingFee(orderAmount);

  return { orderAmount, shippingFee, totalAmount: orderAmount + shippingFee };
}

const containerStyle = css`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`;

const captionStyle = css`
  padding: 12px 0;
`;

const selectAllRowStyle = css`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 20px 0;
`;

const scrollableStyle = css`
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const itemListStyle = css`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
