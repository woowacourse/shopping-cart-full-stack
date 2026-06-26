import styled from "@emotion/styled";
import { useNavigate } from "react-router";
import Info from "../../../commons/images/info.svg?react";
import Checkbox from "../../../commons/components/Checkbox";
import CartItemList from "./CartItemList";
import PriceSummary from "../../../commons/components/PriceSummary";
import Cart from "../domain/Cart";
import CartPricing from "../domain/CartPricing";
import DeliveryFee from "../domain/DeliveryFee";
import { FREE_THRESHOLD, DELIVERY_FEE } from "../constants";
import { FixedButton } from "../../../commons/styles/Button";
import { SelectedItemsLocalStorage } from "../storages/SelectedItemsStorage";
import useCartItems from "../hooks/useCartItems";
import useCartItemSelected from "../hooks/useCartItemSelected";
import useError from "../hooks/useError";
import NetworkError from "../../../commons/components/NetworkError";
import Loading from "./Loading";
import Toast from "../../../commons/components/Toast";
import { useEffect, useEffectEvent, useMemo } from "react";
import { createOrder } from "../api";

export default function Section() {
  const navigate = useNavigate();
  const storage = new SelectedItemsLocalStorage();

  const {
    items: cartItems,
    initialLoadStatus,
    removeItem,
    updateItem,
  } = useCartItems();

  const {
    selectedItemId,
    initSelectedItemId,
    onChangeSelected,
    onChangeAllSelected,
  } = useCartItemSelected(storage);

  const { networkError, error, handleError, clearError } = useError();

  const cart = useMemo(
    () => new Cart(cartItems, selectedItemId),
    [selectedItemId, cartItems],
  );
  const cartPricing = useMemo(
    () => new CartPricing(cart, new DeliveryFee(DELIVERY_FEE, FREE_THRESHOLD)),
    [cart],
  );

  const priceSummary = cartPricing.calculatePriceSummary();

  const onUpdateQuantity = async (
    itemId: string,
    body: { quantity: number },
  ) => {
    const { success, error } = await updateItem(itemId, body);
    if (success) {
      clearError();
      return;
    }
    if (error) {
      handleError(error);
    }
  };

  const onDeleteItem = async (itemId: string) => {
    const { success, error } = await removeItem(itemId);
    // 아이템이 선택된 상태로 제거되면 선택상태또한 제거됩니다.
    if (success) {
      clearError();
      onChangeSelected(false, itemId);
      return;
    }
    if (error) {
      handleError(error);
    }
  };

  const goToOrderCheckPage = async () => {
    const selectedItems = cartItems
      .filter((item) => selectedItemId?.includes(item.product_id))
      .map(({ product_id, quantity }) => ({ product_id, quantity }));

    const { order_id } = await createOrder(selectedItems);
    navigate(`/cart/check/${order_id}/`);
  };

  const allSelect = useEffectEvent(() => {
    if (selectedItemId === null) {
      initSelectedItemId(cartItems.map((item) => item.product_id));
    }
  });

  useEffect(
    function isFirstVisit() {
      if (initialLoadStatus === "success") {
        allSelect();
      }
    },
    [initialLoadStatus],
  );

  return (
    <SectionLayout>
      {initialLoadStatus === "loading" && <Loading />}
      {initialLoadStatus === "success" && (
        <>
          <Header>
            <Title>장바구니</Title>
            {cartItems.length > 0 && (
              <SubText>
                현재 {cartItems.length}종류의 상품이 담겨있습니다.
              </SubText>
            )}
          </Header>
          {cartItems.length ? (
            <>
              <Checkbox
                checked={cart.isItemAllSelected()}
                labelText={"전체선택"}
                onChange={() =>
                  onChangeAllSelected(cartItems.map((item) => item.product_id))
                }
              ></Checkbox>
              <CartItemList
                cartItems={cartItems}
                onUpdateQuantity={onUpdateQuantity}
                onDeleteItem={onDeleteItem}
                onChangeSelected={onChangeSelected}
                selectedItemId={selectedItemId}
              />
              <SubText className="icon-text">
                <Info aria-label="정보" />총 주문 금액이 100,000원 이상일 경우
                무료 배송됩니다.
              </SubText>
              <PriceSummary
                rows={[
                  { label: "주문 금액", value: priceSummary.price },
                  { label: "배송비", value: priceSummary.delivery },
                ]}
                total={{
                  label: "총 결제 금액",
                  value: priceSummary.totalPrice,
                }}
              />
            </>
          ) : (
            <EmptyCart>
              <p>장바구니에 담은 상품이 없습니다.</p>
            </EmptyCart>
          )}
          <FixedButton
            disabled={!cart.selectedItemCount()}
            onClick={goToOrderCheckPage}
          >
            주문 확인
          </FixedButton>
        </>
      )}
      {(initialLoadStatus === "error" || networkError) && <NetworkError />}
      {error && <Toast message={error} onClose={clearError} />}
    </SectionLayout>
  );
}

const Header = styled.div`
  margin: 2rem 0;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin: 12px 0;
`;

const SubText = styled.p`
  font-weight: 500;
  font-size: 12px;
`;

const SectionLayout = styled.section`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1.5rem;
  margin-bottom: 4rem;
  overflow: scroll;

  .icon-text {
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;

const EmptyCart = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;
