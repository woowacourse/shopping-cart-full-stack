import { useNavigate } from "react-router-dom";
import type { CartItemModel } from "../../../../../domain/cart/cart.api";
import CartEmpty from "./CartEmpty";
import { useCartSelectionContext } from "../../../CartSelectionContext";
import BaseButton from "../../../../../shared/components/BaseButton";
import CartContent from "./CartContent/CartContent";
import styled from "@emotion/styled";
import useAsyncTask from "../../../../../shared/useAsyncTask";
import { createCheckout } from "../../../../../domain/checkout/checkout.api";

const CartSuccess = ({ cartItems }: { cartItems: CartItemModel[] }) => {
  return (
    <>
      {cartItems.length === 0 ? (
        <CartEmpty />
      ) : (
        <CartContent cartItems={cartItems} />
      )}
      <BottomArea>
        <OrderConfirmButton cartItems={cartItems} />
      </BottomArea>
    </>
  );
};

export default CartSuccess;

const BottomArea = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  width: min(100vw, 400px);
  transform: translateX(-50%);
`;

const OrderConfirmButton = ({ cartItems }: { cartItems: CartItemModel[] }) => {
  const navigate = useNavigate();
  const { asyncState, executeAsyncFunction } = useAsyncTask<number>();
  const { selectedProductIds } = useCartSelectionContext();
  const isOrderConfirm =
    cartItems.length === 0 || selectedProductIds.length === 0;

  const handleOrderConfirmButtonClick = () => {
    executeAsyncFunction({
      asyncFunction: () => createCheckout(1, selectedProductIds),
      options: {
        onSuccess: (checkoutId) => {
          navigate(`/checkout/${checkoutId}`);
        },
        onFail: (error) => alert(error.message),
        showLoading: true,
      },
    });
  };

  return (
    <BaseButton
      disabled={isOrderConfirm || asyncState.status === "loading"}
      onClick={handleOrderConfirmButtonClick}
      style={"black"}
      display="full"
      rounded="none"
    >
      주문 확인
    </BaseButton>
  );
};
