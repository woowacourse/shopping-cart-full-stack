import CartItemList from "./CartItemList/CartItemList";
import CartPaymentSummary from "./CartPaymentSummary";
import styled from "@emotion/styled";
import { typography } from "../../../../../../shared/styles/typography";
import type { CartItemModel } from "../../../../../../domain/cart/cart.api";

const CartContent = ({ cartItems }: { cartItems: CartItemModel[] }) => {
  return (
    <CartContentLayout>
      <CartContentText>
        현재{cartItems.length}종류의 상품이 담겨있습니다.
      </CartContentText>

      <CartItemList cartItems={cartItems} />

      <CartPaymentSummary cartItems={cartItems} />
    </CartContentLayout>
  );
};

export default CartContent;

const CartContentLayout = styled.div`
  width: 100%;
  height: 100%;
`;

const CartContentText = styled.div`
  ${typography.bodySmall}
  margin-bottom: 30px;
`;
