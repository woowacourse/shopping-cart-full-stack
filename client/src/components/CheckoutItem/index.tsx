import { css } from "@emotion/react";
import Item from "../Item";
import type { CheckoutItem as CheckoutItemType } from "../../domain/checkout";
import { formatPrice } from "../../utils/format";

interface CheckoutItemProps {
  item: CheckoutItemType;
}

export default function CheckoutItem({ item }: CheckoutItemProps) {
  return (
    <Item>
      <Item.Main>
        <Item.Thumbnail src={item.imageUrl} alt={item.name} />
        <div css={infoStyle}>
          <div css={productStyle}>
            <Item.TextSm>{item.name}</Item.TextSm>
            <Item.TextXl>{formatPrice(item.price)}</Item.TextXl>
          </div>
          <Item.TextSm>{item.quantity}개</Item.TextSm>
        </div>
      </Item.Main>
    </Item>
  );
}

const infoStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 24px;
`;

const productStyle = css`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
