import { css } from "@emotion/react";
import { useOptimisticRemoveCartItem } from "../../hooks/useOptimisticRemoveCartItem";
import { useUpdateCartItemQuantity } from "../../hooks/useUpdateCartItemQuantity";
import { CART_ITEM_STATUS, MAX_PURCHASE_QUANTITY, MIN_PURCHASE_QUANTITY } from "../../domain/cart";
import type { CartItemView } from "../../hooks/useCartList";
import Button from "../Button";
import Checkbox from "../Checkbox";
import Item from "../Item";
import { formatPrice } from "../../utils/format";

interface CartListItemProps {
  cartItem: CartItemView;
  onSelect: (id: number) => void;
}

export default function CartListItem({ cartItem, onSelect }: CartListItemProps) {
  const { id, name, imageUrl, price, quantity, isSelected, status, errorMsg } = cartItem;
  const isPurchaseDisabled = status !== CART_ITEM_STATUS.AVAILABLE;
  const isOutOfStock = status === CART_ITEM_STATUS.OUT_OF_STOCK;

  const { isPending, increaseCartItemQuantity, decreaseCartItemQuantity } = useUpdateCartItemQuantity();
  const { removeCartItem } = useOptimisticRemoveCartItem();

  const handleDecrease = () => decreaseCartItemQuantity(id, quantity);
  const handleIncrease = () => increaseCartItemQuantity(id, quantity);

  const isDecreaseDisabled = isPending || quantity <= MIN_PURCHASE_QUANTITY || isOutOfStock;
  const isIncreaseDisabled = isPending || isPurchaseDisabled || quantity >= MAX_PURCHASE_QUANTITY;

  return (
    <Item disabled={isPurchaseDisabled}>
      <Item.Header>
        <Checkbox checked={isSelected} disabled={isPurchaseDisabled} onChange={() => onSelect(id)} />
        <Button variant="secondary" fit onClick={() => removeCartItem(id)}>
          삭제
        </Button>
      </Item.Header>
      <Item.Main>
        <Item.Thumbnail src={imageUrl} alt={name} />
        <div css={infoStyle}>
          <div css={textGroupStyle}>
            <Item.TextSm>{name}</Item.TextSm>
            <Item.TextXl>{formatPrice(price)}</Item.TextXl>
          </div>
          <div css={quantityRowStyle}>
            <Item.Stepper
              value={quantity}
              onDecrease={handleDecrease}
              onIncrease={handleIncrease}
              decreaseDisabled={isDecreaseDisabled}
              increaseDisabled={isIncreaseDisabled}
            />
            {errorMsg && (
              <span className="typo-sm-r" css={errorMsgStyle}>
                {errorMsg}
              </span>
            )}
          </div>
        </div>
      </Item.Main>
    </Item>
  );
}

const infoStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
`;

const textGroupStyle = css`
  display: flex;
  flex-direction: column;
`;

const quantityRowStyle = css`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  height: 32px;
`;

const errorMsgStyle = css`
  width: 140px;
  color: #e84040;
`;
