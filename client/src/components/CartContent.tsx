import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import Checkbox from './ui/Checkbox';
import CartItem from './CartItem';
import OrderSummary from './OrderSummary';
import { useCartSelection } from '../hooks/useCartSelection';
import { calculateOrderAmount, calculateDeliveryFee } from '../utils/cartCalculations';
import type { CartItemType } from '../types/cartItemType';

interface CartContentProps {
  cartProducts: CartItemType[];
  handleQuantityChange: (productId: number, newQuantity: number) => Promise<void>;
  deleteCartItem: (productId: number) => Promise<void>;
}

function CartContent({ cartProducts, handleQuantityChange, deleteCartItem }: CartContentProps) {
  const navigate = useNavigate();
  const { checkedIds, handleAllCheck, handleItemCheck } = useCartSelection(cartProducts);

  const allChecked = cartProducts.length > 0 && checkedIds.size === cartProducts.length;
  const orderAmount = calculateOrderAmount(cartProducts, checkedIds);
  const deliveryFee = calculateDeliveryFee(orderAmount);
  const totalAmount = orderAmount + deliveryFee;

  return (
    <>
      <CartList>
        <Checkbox checked={allChecked} onChange={handleAllCheck} label="전체선택" />
        {cartProducts.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            checked={checkedIds.has(item.id)}
            onCheck={(checked) => handleItemCheck(item.id, checked)}
            onDelete={() => deleteCartItem(item.id)}
            onQuantityChange={handleQuantityChange}
          />
        ))}
      </CartList>
      <OrderSummary orderAmount={orderAmount} deliveryFee={deliveryFee} totalAmount={totalAmount} />
      <OrderConfirmButton
        disabled={checkedIds.size === 0}
        onClick={() => {
          const checkedProducts = cartProducts.filter((p) => checkedIds.has(p.id));
          navigate('/order', {
            state: {
              products: checkedProducts,
              orderAmount,
              couponDiscount: 0,
              deliveryFee,
              totalAmount,
            },
          });
        }}
      >
        주문하기
      </OrderConfirmButton>
    </>
  );
}

export default CartContent;

const CartList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 0 1.5rem 3.25rem 1.5rem;
  flex: 1;
  overflow-y: auto;
`;

const OrderConfirmButton = styled.button`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 580px;
  height: 64px;
  background-color: ${({ disabled }) => (disabled ? '#BEBEBE' : '#000000')};
  color: #ffffff;
  border: none;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};

  font-family: Noto Sans;
  font-weight: 700;
  font-style: Bold;
  font-size: 16px;
  line-height: 16px;
  letter-spacing: 0%;
  text-align: center;
  vertical-align: middle;
`;
