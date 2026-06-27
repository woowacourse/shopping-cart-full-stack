import type { CartItemType, OrderCheckInfo } from "../types/cart";
import { useCartSelection } from "../hooks/useCartSelection";
import { PageLayout } from "../common/PageLayout";
import { Button } from "../common/Button";
import { CartHeader } from "./CartHeader";
import { CartItems } from "./CartItems";
import { OrderSummary } from "./OrderSummary";
import { useOrderSummary } from "../hooks/useOrderSummary";
import { CART_QUANTITY } from "../domain/cart";

interface CartListProps {
  cartItems: CartItemType[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onDeleteItem: (productId: number) => void;
  onOrderCheck: (info: OrderCheckInfo) => void;
  ordering: boolean;
}

export function CartList({
  cartItems,
  onUpdateQuantity,
  onDeleteItem,
  onOrderCheck,
  ordering,
}: CartListProps) {
  const { isSelected, allSelected, toggleItem, toggleAll } =
    useCartSelection(cartItems);

  const {
    selectedCount,
    totalQuantity,
    orderAmount,
    shippingFee,
    totalAmount,
  } = useOrderSummary(cartItems, isSelected);

  function handleOrderCheck() {
    const products = cartItems
      .filter((item) => isSelected[item.product.id])
      .map((item) => ({ id: item.product.id, quantity: item.quantity }));

    onOrderCheck({ selectedCount, totalQuantity, totalAmount, products });
  }

  return (
    <PageLayout
      footer={
        <Button
          label="주문 확인"
          onClick={handleOrderCheck}
          disabled={ordering}
        />
      }
    >
      <CartHeader itemCount={cartItems.length} />
      <CartItems
        cartItems={cartItems}
        isSelected={isSelected}
        allSelected={allSelected}
        onToggleItem={toggleItem}
        onToggleAll={toggleAll}
        onUpdateQuantity={(productId, quantity) => {
          if (quantity < CART_QUANTITY.MIN) {
            alert(`최소 ${CART_QUANTITY.MIN}개까지 가능합니다.`);
            return;
          }
          if (quantity > CART_QUANTITY.MAX) {
            alert(`최대 ${CART_QUANTITY.MAX}개까지 가능합니다.`);
            return;
          }
          onUpdateQuantity(productId, quantity);
        }}
        onDeleteItem={(productId) => {
          const item = cartItems.find((i) => i.product.id === productId);
          if (confirm(`'${item?.product.name}'을(를) 삭제하시겠습니까?`)) {
            onDeleteItem(productId);
          }
        }}
      />
      <OrderSummary
        orderAmount={orderAmount}
        shippingFee={shippingFee}
        totalAmount={totalAmount}
      />
    </PageLayout>
  );
}
