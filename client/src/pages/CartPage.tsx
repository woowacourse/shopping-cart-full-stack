import styled from '@emotion/styled';
import CartHeader from '../components/Cart/CartHeader';
import CartItemList from '../components/Cart/CartItemList';
import CartItemListSkeleton from '../components/Cart/CartItemListSkeleton';
import CartPaymentBill from '../components/Order/CartPaymentBill';
import { MAX_ORDER_COUNT, MIN_ORDER_COUNT } from '../domain/orderCount';
import { deleteCartItem, getCartList, updateCartItem } from '../api/cart';
import { useQuery } from '../api/useQuery';
import { useCartItemSelect } from '../hooks/useCartItemSelect';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../api/order';
import {
  getSelectedCartItemsCount,
  isSelectedCartItemExist,
} from '../utils/cart';

export default function CartPage() {
  const navigate = useNavigate();
  const { data, isLoading, isSuccess, refetch } = useQuery({
    queryFn: getCartList,
  });
  const cartItems = data?.result.cartItems ?? [];

  const { handleSelect, handleSelectAll } = useCartItemSelect(
    cartItems,
    refetch,
  );

  const handleDelete = async (id: number) => {
    try {
      await deleteCartItem(id);
      refetch();
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      }
    }
  };

  const handleUpdate = async (
    id: number,
    orderCount: number,
    delta: 1 | -1,
  ) => {
    const updatedOrderCount = orderCount + delta;
    if (
      updatedOrderCount < MIN_ORDER_COUNT ||
      updatedOrderCount > MAX_ORDER_COUNT
    ) {
      return;
    }

    try {
      await updateCartItem(id, { orderCount: updatedOrderCount });
      refetch();
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      }
    }
  };

  const handleOrderConfirm = async () => {
    try {
      const selectedItems = cartItems
        .filter((i) => i.isSelected)
        .map((i) => ({
          id: i.id,
          orderCount: i.orderCount,
        }));

      const res = await createOrder(selectedItems);
      const orderId = res.result.id;

      navigate(`order/${orderId}`);
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      }
    }
  };

  return (
    <Container>
      <CartHeader totalCount={getSelectedCartItemsCount(cartItems)} />

      {isLoading && <CartItemListSkeleton />}

      {isSuccess && cartItems.length > 0 && (
        <>
          <CartItemList
            cartItems={cartItems}
            onSelect={handleSelect}
            onSelectAll={handleSelectAll}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
          <CartPaymentBill />
        </>
      )}

      {isSuccess && cartItems.length === 0 && (
        <EmptyItem>장바구니에 담은 상품이 없습니다.</EmptyItem>
      )}

      <OrderConfirmButton
        disabled={cartItems.length === 0 || !isSelectedCartItemExist(cartItems)}
        onClick={handleOrderConfirm}
      >
        주문 확인
      </OrderConfirmButton>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const EmptyItem = styled.p`
  position: absolute;
  top: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  font-size: 16px;
  font-weight: 400;
  color: #0a0d13;
  text-align: center;
`;

const OrderConfirmButton = styled.button`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  min-width: 430px;
  max-width: 1280px;
  width: 100%;
  height: 64px;
  background-color: #000;
  color: #fff;

  &:disabled {
    background-color: #bebebe;
    cursor: not-allowed;
  }
`;
