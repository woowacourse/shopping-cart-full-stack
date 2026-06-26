import type { Product } from "@/types/cartProduct";
import Spacing from "@components/common/shared/layout/Spacing";
import CartItem from "@components/common/shared/ui/CartItem";
import CheckBox from "@components/common/shared/ui/CheckBox";
import Divider from "@components/common/shared/ui/Divider";
import OrderAmount from "@components/common/shared/ui/OrderAmount";
import styled from "@emotion/styled";
import useCheckedProductItems from "@hooks/feature/localStorageValue/useCheckedProductItems";
import useCartItemDeleteMutation from "@hooks/feature/mutation/useCartItemDeleteMutation";
import useCartQuantityUpdateMutation from "@hooks/feature/mutation/useCartQuantityUpdateMutation";
import useCartQuery from "@hooks/feature/query/useCartQuery";
import {
  calcDeliveryFee,
  calcOrderAmount,
  calcTotalAmount,
} from "@libs/carts/utils";
import { COLOR_PALETTE } from "@styles/colorPalette";
import { useEffect, useRef } from "react";

import CartListSectionSkeleton from "./skeleton";

function CartListSection() {
  const { data: cartData } = useCartQuery();
  const { mutate: quantityMutate } = useCartQuantityUpdateMutation();
  const { mutate: deleteMutate } = useCartItemDeleteMutation();

  const { checkedItems, select, unselect, unselectAll, updateCheckedItems } =
    useCheckedProductItems<Product["id"]>();

  const isInitialized = useRef(false);

  useEffect(
    // 초기 렌더링 시 이전에 선택한 상품이 없다면 장바구니의 모든 상품을 선택하도록 설정
    function initializeCheckedItems() {
      if (isInitialized.current) return;
      isInitialized.current = true;

      const storedCheckedItems = checkedItems.filter((id) =>
        cartData.some(({ product }) => product.id === id),
      );

      if (storedCheckedItems.length === 0) {
        updateCheckedItems(cartData.map(({ product }) => product.id));
      }
    },
    [cartData, checkedItems, updateCheckedItems],
  );

  const isAllChecked = cartData.every(({ product }) =>
    checkedItems.includes(product.id),
  );

  const isChecked = (id: string) => checkedItems.includes(id);

  const handleSelectAll = () => {
    if (isAllChecked) return unselectAll();

    updateCheckedItems(cartData.map(({ product }) => product.id));
  };

  const handleSelect = (id: string) => {
    if (isChecked(id)) return unselect(id);

    select(id);
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    quantityMutate({ id, quantity });
  };

  const handleDelete = (id: string) => {
    deleteMutate({ id });
    unselect(id);
  };

  if (cartData.length === 0)
    return (
      <EmptyCartContainer>
        <EmptyCartText>장바구니에 담은 상품이 없습니다.</EmptyCartText>
      </EmptyCartContainer>
    );

  const orderAmount = calcOrderAmount(cartData, checkedItems);
  const deliveryFee = calcDeliveryFee(orderAmount);
  const totalAmount = calcTotalAmount(orderAmount, deliveryFee);

  return (
    <>
      <CartListContainer>
        <SelectAllWrapper>
          <CheckBox checked={isAllChecked} onChange={() => handleSelectAll()} />
          전체선택
        </SelectAllWrapper>
        <Spacing size={1.25} />
        <CartListWrapper>
          {cartData.map(({ product, quantity }) => (
            <CartItemContainer key={product.id}>
              <Divider />
              <Spacing size={0.75} />
              <ActionButtonWrapper>
                <CheckBox
                  checked={checkedItems.includes(product.id)}
                  onChange={() => handleSelect(product.id)}
                />
                <DeleteButton onClick={() => handleDelete(product.id)}>
                  삭제
                </DeleteButton>
              </ActionButtonWrapper>
              <Spacing size={0.75} />
              <CartItem
                {...product}
                quantity={quantity}
                quantityRange={{ min: 1, max: 99 }}
                onChangeQuantity={(newQuantity) =>
                  handleQuantityChange(product.id, newQuantity)
                }
              />
            </CartItemContainer>
          ))}
        </CartListWrapper>
        <Spacing size={3.25} />
      </CartListContainer>
      <OrderAmount
        orderAmount={orderAmount}
        deliveryFee={deliveryFee}
        totalAmount={totalAmount}
      />
    </>
  );
}

const EmptyCartContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const EmptyCartText = styled.p`
  font-weight: 400;
  font-size: 16px;
  line-height: 16px;
`;

const CartListContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const SelectAllWrapper = styled.label`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  font-weight: 500;
  font-size: 0.75rem;
  line-height: 0.9375rem;
`;

const CartListWrapper = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const CartItemContainer = styled.li``;

const ActionButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DeleteButton = styled.button`
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid ${COLOR_PALETTE.border};
  background-color: ${COLOR_PALETTE.white};
  font-weight: 500;
  font-size: 0.75rem;
  line-height: 0.9375rem;

  :active {
    background-color: ${COLOR_PALETTE.border};
  }
`;

CartListSection.Skeleton = CartListSectionSkeleton;

export default CartListSection;
