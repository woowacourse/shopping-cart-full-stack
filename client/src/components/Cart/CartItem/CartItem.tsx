import ProductItemLayout from "../../../commons/ProductItemLayout/ProductItemLayout";
import SelectionCheckbox from "../../../commons/SelectionCheckbox/SelectionCheckbox";
import type { UseCartDataReturn } from "../../../hooks/useCartData.types";
import type {
  CartActions,
  CartItemModel,
} from "../../../hooks/useCartItems.types";
import {
  Container,
  ControlButton,
  DeleteButton,
  QuantityControls,
  TopRow,
} from "./CartItem.styles";

interface Props {
  item: CartItemModel;
  onUpdateQuantity: UseCartDataReturn["updateQuantity"];
  onDeleteItem: CartActions["handleDeleteItem"];
  onToggleItem: CartActions["toggleSelection"];
}

const CartItem = ({
  item,
  onUpdateQuantity,
  onDeleteItem,
  onToggleItem,
}: Props) => {
  const handleDecreaseClick = () => {
    onUpdateQuantity(item.id, item.quantity - 1);
  };

  const handleIncreaseClick = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  return (
    <Container>
      <TopRow>
        <SelectionCheckbox
          id={`cart-item-${item.id}`}
          isChecked={item.isSelected}
          aria-label={`${item.name} 선택`}
          onClick={() => onToggleItem(item.id)}
        />
        <DeleteButton type="button" onClick={() => onDeleteItem(item.id)}>
          삭제
        </DeleteButton>
      </TopRow>
      <ProductItemLayout
        image={item.imageUrl}
        name={item.name}
        price={item.price}
        quantityContent={
          <QuantityControls>
            <ControlButton type="button" onClick={handleDecreaseClick}>
              -
            </ControlButton>
            <span>{item.quantity}</span>
            <ControlButton type="button" onClick={handleIncreaseClick}>
              +
            </ControlButton>
          </QuantityControls>
        }
      />
    </Container>
  );
};

export default CartItem;
