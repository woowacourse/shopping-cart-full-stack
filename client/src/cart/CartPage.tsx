import styled from '@emotion/styled';
import PageLayout from '../components/PageLayout';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import CheckBox from '../components/CheckBox';
import NoticeIcon from '../Icons/NoticeIcon';
import { useCartItems } from './hooks/useCartItems';
import { useCartSelection } from './hooks/useCartSelection';
import CartSummaryRow from './components/CartSummaryRow';
import { calCartSummary } from './utils/calculateCartSummary';
import CartItemRow from './components/CartItemRow';
import CartContent from './components/CartContent';
import { localSelectionStorage } from '../repositories/localSelectionStorage';
import { createOrderSheet } from '../apis/orderSheet';
import {
  ContentDescription,
  Notice,
  PageTitle,
} from '../components/Typography';

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    isLoading,
    error,
    removeCartItem,
    updateCartItemQuantity,
  } = useCartItems();
  const {
    selectedProductIds,
    isAllSelected,
    toggleItem,
    toggleAll,
    deselectItem,
  } = useCartSelection(cartItems, localSelectionStorage);

  const { orderAmount, shippingFee, totalPaymentAmount } = calCartSummary(
    cartItems,
    selectedProductIds,
  );

  const handleCartItemRemove = async (productId: string) => {
    try {
      await removeCartItem(productId);
      deselectItem(productId);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : '장바구니 상품을 삭제하지 못했습니다.',
      );
    }
  };

  const handleCartItemQuantityChange = async (
    productId: string,
    quantity: number,
  ) => {
    try {
      await updateCartItemQuantity(productId, quantity);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : '장바구니 상품 수량을 변경하지 못했습니다.',
      );
    }
  };

  const handleOrderConfirm = async () => {
    const orderItems = cartItems
      .filter(({ product }) => selectedProductIds.includes(product.id))
      .map(({ product, quantity }) => ({
        productId: product.id,
        quantity,
      }));

    try {
      const { id: orderSheetId } = await createOrderSheet(orderItems);

      navigate(`/order-confirm/${orderSheetId}`);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : '주문 정보를 준비하지 못했습니다. 다시 시도해 주세요.',
      );
    }
  };

  const isCartEmpty = cartItems.length === 0;

  return (
    <PageLayout headerContent={<Logo>SHOP</Logo>}>
      <PageTitle>장바구니</PageTitle>

      <CartContent isLoading={isLoading} error={error} isEmpty={isCartEmpty}>
        <CartItemsSection aria-label="장바구니 상품">
          <ContentDescription>
            현재 {cartItems.length}종류의 상품이 담겨있습니다.
          </ContentDescription>

          <SelectAllControl>
            <CheckBox
              checked={isAllSelected}
              label="전체선택"
              onToggle={toggleAll}
            />
          </SelectAllControl>

          {cartItems.map(({ product, quantity }) => (
            <CartItemRow
              key={product.id}
              product={product}
              quantity={quantity}
              checked={selectedProductIds.includes(product.id)}
              onCheckedChange={() => toggleItem(product.id)}
              onQuantityChange={(nextQuantity) =>
                handleCartItemQuantityChange(product.id, nextQuantity)
              }
              onRemoveClick={() => handleCartItemRemove(product.id)}
            />
          ))}
        </CartItemsSection>

        <NoticeSection>
          <NoticeIcon />
          <Notice>총 주문 금액이 100,000원 이상일 경우 무료 배송됩니다.</Notice>
        </NoticeSection>

        <CartSummarySection aria-label="주문 금액 요약">
          <CartSummaryRow label="주문 금액" amount={orderAmount} />
          <CartSummaryRow label="배송비" amount={shippingFee} />

          <SummaryDivider />
          <CartSummaryRow label="총 결제 금액" amount={totalPaymentAmount} />
        </CartSummarySection>
      </CartContent>

      <BottomButtonWrapper>
        <Button
          fullWidth
          disabled={selectedProductIds.length === 0}
          onClick={handleOrderConfirm}
        >
          주문 확인
        </Button>
      </BottomButtonWrapper>
    </PageLayout>
  );
};

const Logo = styled.h1`
  margin: 0;
  font-weight: 800;
  font-size: 1.25rem;
  color: #ffffff;
`;

const CartItemsSection = styled.section``;

const SelectAllControl = styled.div`
  padding-block: 0.75rem;
`;

const NoticeSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin: 0.5rem 0;
  padding-top: 1rem;
`;

const CartSummarySection = styled.section`
  margin-top: 0.75rem;
  border-top: 1px solid #0000001a;
`;

const SummaryDivider = styled.hr`
  height: 1px;
  margin: 0.75rem 0;
  border: 0;
  background-color: #0000001a;
`;

const BottomButtonWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  width: 100%;
  max-width: 26rem;
  transform: translateX(-50%);
  z-index: 100;
`;

export default CartPage;
