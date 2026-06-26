import styled from '@emotion/styled';
import CheckBox from '../../components/CheckBox';
import Stepper from '../../components/Stepper';
import type { Product } from '../../apis/cart';
import CartItem from './CartItem';

interface CartItemRowProps {
  product: Product;
  quantity: number;
  checked: boolean;
  onCheckedChange: () => void;
  onQuantityChange: (quantity: number) => void;
  onRemoveClick: () => void;
}

const CartItemRow = ({
  product,
  quantity,
  checked,
  onCheckedChange,
  onQuantityChange,
  onRemoveClick,
}: CartItemRowProps) => {
  return (
    <CartItemContainer key={product.id}>
      <ItemHeader>
        <CheckBox
          ariaLabel={`${product.name} 선택`}
          checked={checked}
          onToggle={onCheckedChange}
        />
        <RemoveButton type="button" onClick={onRemoveClick}>
          삭제
        </RemoveButton>
      </ItemHeader>

      <CartItem
        name={product.name}
        thumbnail={product.thumbnail}
        price={product.price}
      >
        <Stepper value={quantity} onChange={onQuantityChange} />
      </CartItem>
    </CartItemContainer>
  );
};

const CartItemContainer = styled.div`
  padding-block: 0.75rem;
  border-top: 1px solid #0000001a;
`;

const ItemHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RemoveButton = styled.button`
  padding: 0.3rem 0.55rem;
  border: 1px solid #0000001a;
  border-radius: 0.25rem;
  background-color: #ffffff;
  font-size: 0.625rem;
`;

export default CartItemRow;
