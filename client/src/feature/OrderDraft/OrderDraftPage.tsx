import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useOrder } from './hooks/useOrder';
import { OrderSuccessView } from './components/OrderSuccessView';
import { Header } from '../../common/components/Header';
import { Container, Wrapper } from '../../common/styles/global';
import { Button } from '../../common/components/Button';
import styled from 'styled-components';
import { OrderSkeletonView } from './components/OrderSkeletonView';
import { OrderErrorView } from './components/OrderErrorView';
import type { OrderConfirmSummary } from '../OrderConfirm/types/orderConfirm.types';

export const OrderDraftPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = (location.state as { orderId?: string } | null)?.orderId;

  const {
    data,
    isLoading,
    error,
    loadOrder,
    changeOrderIsIsland,
    orderActionError,
  } = useOrder(orderId);

  if (!orderId) {
    return <Navigate to="/cart" replace />;
  }

  const cartFetchStatus = isLoading ? 'loading' : error ? 'error' : 'success';

  const handlePayment = () => {
    if (!data) return;

    const orderSummary: OrderConfirmSummary = {
      productKindCount: data.products.length,
      totalProductCount: data.products.reduce(
        (totalCount, product) => totalCount + product.quantity,
        0,
      ),
      totalPrice: data.priceInfo.totalPrice,
    };

    navigate('/order-confirm', {
      replace: true,
      state: orderSummary,
    });
  };

  const 비동기_상태에_따라_컴포넌트_보여주기 = () => {
    if (isLoading) {
      return <OrderSkeletonView />;
    }

    if (error) {
      return <OrderErrorView error={error} />;
    }

    if (data) {
      return (
        <OrderSuccessView
          data={data}
          loadOrder={loadOrder}
          changeOrderIsIsland={changeOrderIsIsland}
        />
      );
    }

    return <OrderSkeletonView />;
  };

  return (
    <Wrapper>
      <OrderDraftContainer>
        <Header
          left={
            <button
              type="button"
              onClick={() => navigate('/cart', { replace: true })}
            >
              ←
            </button>
          }
        />
        <ContentArea>{비동기_상태에_따라_컴포넌트_보여주기()}</ContentArea>
        <ButtonArea>
          {orderActionError && (
            <ErrorMessage role="alert">{orderActionError.message}</ErrorMessage>
          )}
          <Button
            disabled={cartFetchStatus !== 'success' || !data}
            onClick={handlePayment}
          >
            결제하기
          </Button>
        </ButtonArea>
      </OrderDraftContainer>
    </Wrapper>
  );
};

const OrderDraftContainer = styled(Container)`
  position: relative;
  overflow: hidden;
`;

const ContentArea = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  min-height: 0;
  padding: 0 20px;
`;

const ButtonArea = styled.div`
  flex-shrink: 0;

  background-color: #ffffff;
`;

const ErrorMessage = styled.p`
  margin: 0 0 8px;

  color: #c62828;
  font-size: 13px;
  font-weight: 600;
  text-align: center;
`;
