import {
  deleteCartItem,
  getCart,
  updateCartQuantity,
  updateCartSelect,
  updateCartSelectAll,
} from '../apis/cartApi';
import type { Cart } from '../types';

const useCartActions = (setCart: (cart: Cart) => void) => {
  const handleSelect = async (productId: string, nextCheckStatus: boolean) => {
    try {
      await updateCartSelect(productId, nextCheckStatus);
      setCart(await getCart());
    } catch (error) {
      console.error(error);
      alert('상품 선택에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const handleSelectAll = async (nextIsAllSelected: boolean) => {
    try {
      await updateCartSelectAll(nextIsAllSelected);
      setCart(await getCart());
    } catch (error) {
      console.error(error);
      alert('전체 선택에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      await deleteCartItem(productId);
      setCart(await getCart());
    } catch (error) {
      console.error(error);
      alert('상품 삭제에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const handleQuantity = async (productId: string, quantity: number) => {
    try {
      await updateCartQuantity(productId, quantity);
      setCart(await getCart());
    } catch (error) {
      console.error(error);
      alert('수량 변경에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  return { handleSelect, handleSelectAll, handleDelete, handleQuantity };
};

export default useCartActions;
