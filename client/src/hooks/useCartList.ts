import { CART_ITEM_STATUS, getCartItemStatusMessage, type CartItem } from "../domain/cart";
import { useCartQuery } from "./useCartQuery";
import { useCartSelection } from "./useCartSelection";

export interface CartItemView extends CartItem {
  isSelected: boolean;
  errorMsg?: string;
}

function canPurchaseCart(cartList: CartItemView[]): boolean {
  const selectedCartItems = cartList.filter((item) => item.isSelected && item.status === CART_ITEM_STATUS.AVAILABLE);

  return selectedCartItems.length > 0;
}

export function useCartList() {
  const { cartItems, isLoading, hasError, refetch } = useCartQuery();
  const { getItemSelection, toggleItemSelection, toggleAllItemSelection } = useCartSelection();

  const cartList: CartItemView[] = cartItems.map((item) => ({
    ...item,
    isSelected: getItemSelection(item.id),
    errorMsg: getCartItemStatusMessage(item.status, item.stock, item.quantity),
  }));

  const hasNoCartItem = !isLoading && !hasError && cartList.length === 0;
  const hasCartItem = !isLoading && !hasError && cartList.length > 0;
  const isAllSelected = cartList.length > 0 && cartList.every((item) => item.isSelected);
  const isAbleToPurchase = !isLoading && canPurchaseCart(cartList);

  const selectItem = (id: number) => {
    toggleItemSelection(id);
  };

  const selectAllItem = () => {
    const shouldSelectAll = !isAllSelected;
    const ids = cartList.map((item) => item.id);
    toggleAllItemSelection(ids, shouldSelectAll);
  };

  return {
    cartList,
    isLoading,
    hasError,
    refetch,
    hasNoCartItem,
    hasCartItem,
    isAllSelected,
    isAbleToPurchase,
    getItemSelection,
    selectItem,
    selectAllItem,
  };
}
