import { useEffect, useState } from 'react';
import {
  deleteCartItems,
  getCartItems,
  patchCartItemQuantity,
  type CartItemResponse,
} from '../../apis/cart';

export const useCartItems = () => {
  const [cartItems, setCartItems] = useState<CartItemResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const items = await getCartItems();
        setCartItems(items);
      } catch (error) {
        setError(
          error instanceof Error
            ? error
            : new Error('장바구니 상품 목록을 불러오지 못했습니다.'),
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const removeCartItem = async (productId: string) => {
    await deleteCartItems(productId);
    setCartItems((prev) =>
      prev.filter(({ product }) => product.id !== productId),
    );
  };

  const updateCartItemQuantity = async (
    productId: string,
    quantity: number,
  ) => {
    const updated = await patchCartItemQuantity(productId, quantity);
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === updated.productId
          ? { ...item, quantity: updated.quantity }
          : item,
      ),
    );
  };

  return {
    cartItems,
    isLoading,
    error,
    removeCartItem,
    updateCartItemQuantity,
  };
};
