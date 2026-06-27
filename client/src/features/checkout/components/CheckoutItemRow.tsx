import styled from "@emotion/styled";
import type { CartItem } from "../../cart/types";
import { CartItemContent } from "../../cart/components/CartItemContent";
import { colors } from "../../../shared/styles/tokens";

export function CheckoutItemRow({ item }: { item: CartItem }) {
  return (
    <Wrapper>
      <CartItemContent product={item.product}>
        <Quantity>수량 {item.quantity}개</Quantity>
      </CartItemContent>
    </Wrapper>
  );
}

const Wrapper = styled.li`
  padding: 12px 0;
  border-top: 1px solid ${colors.divider};
  list-style: none;
`;
const Quantity = styled.span`
  font-size: 12px;
  color: ${colors.textPrimary};
`;
