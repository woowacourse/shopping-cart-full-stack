import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../common/components/Button';
import { Header } from '../../common/components/Header';
import { CartItemListSection } from './components/CartItemListSection';
import { CartEmptyView } from './components/CartEmptyView';
import { CartErrorView } from './components/CartErrorView';
import { CartSkeleton } from './components/CartSkeleton';
import { CartSummary } from './components/CartSummary';
import { useCartContext } from './context/CartContext';
import { CartProvider } from './context/CartProvider';
import { Container, Wrapper } from '../../common/styles/global';
import styled from 'styled-components';
import { useCreateOrder } from './hooks/useCreateOrder';

export const CartPage = () => {
  return (
    <Wrapper>
      <Container>
        <CartProvider>
          <Header title="SHOP" />
          <CartOrderForm />
        </CartProvider>
      </Container>
    </Wrapper>
  );
};

// 페이지 이동을 위한 Form 컴포넌트
const CartOrderForm = () => {
  const navigate = useNavigate();
  const { cartItems, selectedCartItemIds, cartFetchStatus, cartActionError } =
    useCartContext();

  const { createOrder } = useCreateOrder();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // 주문 테이블에 맞게 컨텍스트 구성
    const selectedCartItems = cartItems.filter((item) =>
      selectedCartItemIds.includes(item.cartItemId),
    );

    const postingOrderData = {
      products: selectedCartItems.map((item) => ({
        productId: item.productId,
        quantity: item.purchaseQuantity,
      })),
    };

    // 주문 테이블 생성
    const createdOrder = await createOrder(postingOrderData);

    if (!createdOrder) return;

    navigate('/order-draft', {
      state: {
        orderId: createdOrder.orderId,
      },
    });
  };

  const isOrderDisabled =
    cartFetchStatus !== 'success' || selectedCartItemIds.length === 0;

  return (
    <OrderForm onSubmit={handleSubmit}>
      <CartContentArea>
        <CartContent />
      </CartContentArea>

      {cartActionError && (
        <ErrorMessage role="alert">{cartActionError.message}</ErrorMessage>
      )}
      <Button type="submit" disabled={isOrderDisabled}>
        주문 확인
      </Button>
    </OrderForm>
  );
};

const CartContent = () => {
  const { cartItems, cartFetchStatus, cartFetchError, loadCartItems } =
    useCartContext();

  if (cartFetchStatus === 'idle' || cartFetchStatus === 'loading') {
    return <CartSkeleton />;
  }

  if (cartFetchStatus === 'error') {
    return <CartErrorView error={cartFetchError} onRetry={loadCartItems} />;
  }

  if (cartItems.length === 0) {
    return <CartEmptyView />;
  }

  return (
    <CartSuccessContent>
      <CartItemListSection />
      <CartSummary />
    </CartSuccessContent>
  );
};

const OrderForm = styled.form`
  display: flex;
  flex-direction: column;

  flex: 1;
  min-height: 0;
`;

const CartContentArea = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  padding: 24px 20px 16px;
`;

const CartSuccessContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
`;

const ErrorMessage = styled.p`
  margin: 0 0 8px;

  color: #c62828;
  font-size: 13px;
  font-weight: 600;
  text-align: center;
`;
