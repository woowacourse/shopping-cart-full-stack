import { useCartContext } from '../context/CartContext';
import { calculateCartOrderSummary } from '../utils/calculateCartOrderSummary';
import { CartSummaryLine } from './CartSummaryLine';
import styled from 'styled-components';

export const CartSummary = () => {
  const { cartItems, selectedCartItemIds } = useCartContext();
  const { orderPrice, deliveryPrice, totalPrice } = calculateCartOrderSummary(
    cartItems,
    selectedCartItemIds,
  );

  return (
    <SummarySection>
      <DeliveryNotice>
        총 주문 금액이 100,000원 이상일 경우 무료 배송됩니다.
      </DeliveryNotice>
      <SummaryBox>
        <CartSummaryLine title="주문 금액" value={orderPrice} />
        <CartSummaryLine title="배송비" value={deliveryPrice} />
        <Divider />
        <CartSummaryLine title="총 결제 금액" value={totalPrice} />
      </SummaryBox>
    </SummarySection>
  );
};

const SummarySection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 8px;
`;

const DeliveryNotice = styled.p`
  margin: 0;

  color: #000000;
  font-size: 11px;
  font-weight: 700;
  line-height: 1.4;

  &::before {
    content: 'ⓘ';
    margin-right: 4px;
  }
`;

const SummaryBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Divider = styled.hr`
  width: 100%;
  height: 1px;
  margin: 0;
  border: 0;

  background-color: #eeeeee;
`;
