import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import { useCartItems } from "./hooks/useCartItems";
import { useCheckedItems } from "./hooks/useCheckedItems";
import CartItem from "./components/CartItemsList";
import OrderBox from "./components/OrderBox";
import type { ShoppingCartItem } from "./types";
import { calculateOrderSummary } from "./domain/calculateOrderSummary";

export default function ShoppingCart() {
  const navigate = useNavigate();
  const {
    shoppingCartItems,
    isLoading,
    error,
    setError,
    changeQuantity,
    handleDeleteItem,
  } = useCartItems();

  const {
    checkedIdsSet,
    handleItemChoice,
    handleAllCheckedById,
    removeChecked,
  } = useCheckedItems(shoppingCartItems);

  const handleDelete = async (item: ShoppingCartItem) => {
    const ok = await handleDeleteItem(item);
    if (ok) removeChecked(item.product.id);
  };

  const { orderAmount, deliveryFee, totalPayment } = calculateOrderSummary(
    shoppingCartItems,
    checkedIdsSet,
  );

  const handleSubmit = () => {
    navigate("/checkorder", {
      state: {
        selectedItems: shoppingCartItems.filter((item) =>
          checkedIdsSet.has(item.product.id),
        ),
      },
    });
  };

  return (
    <Container>
      <Header>
        <span>SHOP</span>
      </Header>

      {isLoading && (
        <SpinnerWrapper>
          <Spinner role="status" aria-label="로딩 중" />
        </SpinnerWrapper>
      )}

      {!isLoading && shoppingCartItems.length === 0 && (
        <main>
          <PageHeader>
            <h2>장바구니</h2>
          </PageHeader>
          <NoItemsInCart>
            <p>장바구니에 담은 상품이 없습니다.</p>
          </NoItemsInCart>
        </main>
      )}

      {!isLoading && shoppingCartItems.length !== 0 && (
        <main>
          <PageHeader>
            <h2>장바구니</h2>
            <p>현재 {shoppingCartItems.length}종류의 상품이 담겨있습니다.</p>
          </PageHeader>
          <CartItem
            shoppingCartItems={shoppingCartItems}
            checkedIdsSet={checkedIdsSet}
            onToggleAll={handleAllCheckedById}
            onToggleItem={handleItemChoice}
            onDelete={handleDelete}
            onChangeQuantity={changeQuantity}
          />

          <OrderBox
            orderAmount={orderAmount}
            checkDeliveryFee={deliveryFee}
            totalPayment={totalPayment}
          />
        </main>
      )}

      <OrderCheckButton
        disabled={shoppingCartItems.length === 0 || checkedIdsSet.size === 0}
        onClick={handleSubmit}
      >
        주문 확인
      </OrderCheckButton>

      {error && (
        <ErrorOverlay onClick={() => setError("")}>
          <ErrorBox onClick={(e) => e.stopPropagation()}>
            <p>{error}</p>
            <button onClick={() => setError("")}>닫기</button>
          </ErrorBox>
        </ErrorOverlay>
      )}
    </Container>
  );
}

const NoItemsInCart = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: calc(100svh - 250px);
`;

const ErrorOverlay = styled.div`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ErrorBox = styled.div`
  width: 80%;
  max-width: 320px;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 12px;
  padding: 24px 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  p {
    margin: 0;
    font-family: "Noto Sans", sans-serif;
    font-weight: 500;
    font-size: 14px;
    line-height: 1.5;
    text-align: center;
    color: rgba(10, 13, 19, 1);
  }

  button {
    width: 100%;
    height: 44px;
    border: none;
    border-radius: 8px;
    background-color: rgba(0, 0, 0, 1);
    color: rgba(255, 255, 255, 1);
    cursor: pointer;

    font-family: "Noto Sans", sans-serif;
    font-weight: 700;
    font-size: 14px;
    line-height: 16px;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 100px 24px;
`;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 0;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top-color: rgba(0, 0, 0, 1);
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const Header = styled.header`
  background-color: rgba(0, 0, 0, 1);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 64px;
  padding-inline: 24px;
  justify-content: space-between;

  display: flex;
  align-items: center;
  font-family: "Noto Sans", sans-serif;
  font-weight: 800;
  font-size: 20px;
  line-height: 16px;
  color: rgba(255, 255, 255, 1);
`;

const PageHeader = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 36px;

  h2 {
    margin: 0;
    font-family: "Noto Sans", sans-serif;
    font-weight: 700;
    font-size: 24px;
    line-height: 100%;
    color: rgba(0, 0, 0, 1);
  }

  p {
    margin: 0;
    font-family: "Noto Sans", sans-serif;
    font-weight: 500;
    font-size: 12px;
    line-height: 15px;
    color: rgba(10, 13, 19, 1);
  }
`;

const OrderCheckButton = styled.button`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 64px;
  padding: 24px 65px;
  background-color: rgba(0, 0, 0, 1);

  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Noto Sans", sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 16px;
  color: rgba(255, 255, 255, 1);
`;
