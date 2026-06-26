import styled from "@emotion/styled";
import type { CartItemModel } from "../../../../../../../domain/cart/cart.api";
import { formatPrice } from "../../../../../../../shared/utils";
import { typography } from "../../../../../../../shared/styles/typography";
import { useCartContext } from "../../../../../CartContext";
import { useCartSelectionContext } from "../../../../../CartSelectionContext";
import type { AsyncError } from "../../../../../../../../src/error/normalizeError";

const CartItemRow = ({
  cartItem,
  isChecked,
}: {
  cartItem: CartItemModel;
  isChecked: boolean;
}) => {
  const {
    requestGetCartItems,
    requestUpdateCartItemCount,
    updateCartItemCountAsyncState,
    requestDeleteCartItem,
    deleteCartItemAsyncState,
  } = useCartContext();

  const { unselectCartItem, selectCartItem } = useCartSelectionContext();

  const { productId, name, price, itemCount, imgUrl } = cartItem;

  const handleDeleteCartItem = async (productId: number) => {
    await requestDeleteCartItem(productId, {
      onSuccess: () => {
        unselectCartItem(productId);
        requestGetCartItems({ showLoading: false });
      },
      onFail: (error: AsyncError) => alert(error.message),
      showLoading: true,
    });
  };

  const handleUpdateCartItemCount = async (
    productId: number,
    itemCount: number,
  ) => {
    await requestUpdateCartItemCount(productId, itemCount, {
      onSuccess: () => requestGetCartItems({ showLoading: false }),
      onFail: (error: AsyncError) => alert(error.message),
      showLoading: true,
    });
  };

  const handleProductSelect = (productId: number, nextChecked: boolean) => {
    if (nextChecked) {
      selectCartItem(productId);
      return;
    }

    unselectCartItem(productId);
  };

  return (
    <CartItemLayout>
      <Divider />

      <CartItemHeader>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(event) => {
            handleProductSelect(productId, event.target.checked);
          }}
        />
        <DeleteButton
          type="button"
          onClick={() => handleDeleteCartItem(productId)}
          disabled={deleteCartItemAsyncState.status === "loading"}
        >
          삭제
        </DeleteButton>
      </CartItemHeader>

      <CartItemBody>
        <CartItemImage src={imgUrl} alt={`상품 이미지-${name}`} />
        <CartItemInformation>
          <ProductName>{name}</ProductName>
          <ProductPrice>{formatPrice(price * itemCount)}원</ProductPrice>
          <CartItemCountStepper>
            <StepperButton
              type="button"
              onClick={() =>
                handleUpdateCartItemCount(productId, itemCount - 1)
              }
              disabled={
                itemCount <= 1 ||
                deleteCartItemAsyncState.status === "loading" ||
                updateCartItemCountAsyncState.status === "loading"
              }
            >
              -
            </StepperButton>
            {itemCount}
            <StepperButton
              type="button"
              onClick={() =>
                handleUpdateCartItemCount(productId, itemCount + 1)
              }
              disabled={
                deleteCartItemAsyncState.status === "loading" ||
                updateCartItemCountAsyncState.status === "loading"
              }
            >
              +
            </StepperButton>
          </CartItemCountStepper>
        </CartItemInformation>
      </CartItemBody>
    </CartItemLayout>
  );
};

export default CartItemRow;

const CartItemLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #0000001a;
  margin-bottom: 12px;
`;

const CartItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const DeleteButton = styled.button`
  width: 40px;
  height: 24px;
  border: 1px solid #0000001a;
  border-radius: 8px;
  background-color: white;
  color: black;
  font-size: 12px;
  cursor: pointer;

  &:disabled {
    border-color: #e5e5e5;
    color: #bebebe;
    cursor: not-allowed;
  }
`;

const CartItemBody = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 24px;
`;

const CartItemImage = styled.img`
  width: 112px;
  height: 112px;
  border-radius: 8px;
`;

const CartItemInformation = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  gap: 4px;
`;

const ProductName = styled.div`
  ${typography.bodySmall}
`;

const ProductPrice = styled.div`
  ${typography.titleLarge}
`;

const CartItemCountStepper = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
`;

const StepperButton = styled.button`
  width: 24px;
  height: 24px;
  border: 1px solid #0000001a;
  border-radius: 8px;
  background-color: white;
  color: black;
  cursor: pointer;

  &:disabled {
    border-color: #e5e5e5;
    color: #bebebe;
    cursor: not-allowed;
  }
`;
