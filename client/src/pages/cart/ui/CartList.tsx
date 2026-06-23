import { isAllCartItemsSelected } from '../../../entities/cart/selector';
import type { CartItem } from '../../../entities/cart/types';
import CartItemCard from '../../../entities/cart/ui/CartItemCard';
import Checkbox from '../../../shared/ui/CheckBox';
import List from '../../../shared/layout/List';
import { useCartItemActions } from '../hooks/useCartItemActions';
import { useCartQuantityActions } from '../hooks/useCartQuantityActions';
import { useCartSelectionActions } from '../hooks/useCartSelectionActions';
import Flex from '../../../shared/layout/Flex';
import Txt from '../../../shared/ui/Txt';

type CartListProps = {
  cartItems: CartItem[];
};

export default function CartList({ cartItems }: CartListProps) {
  const { increaseQuantity, decreaseQuantity } = useCartQuantityActions();
  const { removeCartItem } = useCartItemActions();
  const { changeCartItemSelection, changeAllCartItemsSelection } =
    useCartSelectionActions();

  const isAllSelected = isAllCartItemsSelected(cartItems);

  return (
    <Flex as="section" direction="column" gap={20}>
      <Checkbox
        checked={isAllSelected}
        onChange={changeAllCartItemsSelection}
      >
        <Txt variant="label" color="text">
          전체선택
        </Txt>
      </Checkbox>
      <List>
        {cartItems.map((cartItem) => {
          return (
            <CartItemCard
              key={cartItem.product.id}
              cartItem={cartItem}
              onIncrease={increaseQuantity}
              onDecrease={decreaseQuantity}
              onDelete={removeCartItem}
              onToggleItem={changeCartItemSelection}
            />
          );
        })}
      </List>
    </Flex>
  );
}
