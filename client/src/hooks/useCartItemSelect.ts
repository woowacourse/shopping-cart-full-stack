import { updateCartItem } from '../api/cart';
import type { CartItemType } from '../types/product.types';
import { isAllCartItemsSelected } from '../utils/cart';

export const useCartItemSelect = (
  cartItems: CartItemType[],
  refetch: () => void,
) => {
  const handleSelect = async (id: number, isSelected: boolean) => {
    try {
      await updateCartItem(id, { isSelected });
      refetch();
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      }
    }
  };

  const handleSelectAll = async () => {
    const next = !isAllCartItemsSelected(cartItems);

    try {
      // TODO: 전체 선택 API 만들기 (병렬 요청 리소스)
      await Promise.all(
        cartItems.map((i) => updateCartItem(i.id, { isSelected: next })),
      );
      refetch();
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      }
    }
  };

  return {
    handleSelect,
    handleSelectAll,
  };
};
