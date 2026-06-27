import CartSection from './CartSection';
import OrderSummary from '../common/OrderSummary';
import type { Cart } from '../../types';
import SectionHeader from '../common/SectionHeader';

type Props = {
  cart: Cart;
  onSelect: (productId: string, nextCheckStatus: boolean) => void;
  onSelectAll: (nextIsAllSelected: boolean) => void;
  onDelete: (productId: string) => Promise<void>;
  onChangeQuantity: (productId: string, quantity: number) => Promise<void>;
};

const CartBody = ({ cart, onSelect, onSelectAll, onDelete, onChangeQuantity }: Props) => {
  return (
    <>
      <SectionHeader title="장바구니">
        <p>현재 {cart.cartItems.length} 종류의 상품이 담겨있습니다.</p>
      </SectionHeader>

      <CartSection
        cartItems={cart.cartItems}
        isAllSelect={cart.isAllSelected}
        onSelectAll={onSelectAll}
        onSelect={onSelect}
        onChangeQuantity={onChangeQuantity}
        onDelete={onDelete}
      />
      <OrderSummary data={cart.payInfo} />
    </>
  );
};

export default CartBody;
