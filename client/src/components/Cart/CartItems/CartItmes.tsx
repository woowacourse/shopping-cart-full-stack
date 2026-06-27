import SelectionCheckbox from "../../../commons/SelectionCheckbox/SelectionCheckbox";
import CartItem from "../CartItem/CartItem";
import type {
  CartActions,
  CartItemModel,
} from "../../../hooks/useCartItems.types";
import { Container, ItemList, SelectAll, Divider } from "./CartItems.styles";
import type { UseCartDataReturn } from "../../../hooks/useCartData.types";

interface Props {
  items: CartItemModel[];
  onUpdateQuantity: UseCartDataReturn["updateQuantity"];
  onDeleteItem: CartActions["handleDeleteItem"];
  onToggleItem: CartActions["toggleSelection"];
  onToggleAll: CartActions["toggleAllSelection"];
  isAllSelected: boolean;
}

const CartItems = ({
  items,
  onUpdateQuantity,
  onDeleteItem,
  onToggleItem,
  onToggleAll,
  isAllSelected,
}: Props) => {
  return (
    <Container>
      <SelectAll>
        <SelectionCheckbox
          id="select-all"
          isChecked={isAllSelected}
          aria-label="전체 선택"
          onClick={onToggleAll}
        />
        <label htmlFor="select-all">전체선택</label>
      </SelectAll>
      <Divider />
      <ItemList>
        {items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            onDeleteItem={onDeleteItem}
            onToggleItem={onToggleItem}
          />
        ))}
      </ItemList>
    </Container>
  );
};

export default CartItems;
