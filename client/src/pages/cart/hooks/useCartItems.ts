import { useCartContext } from '../contexts/CartContext';

export function useCartItems() {
  const { cartItems, isPending, error } = useCartContext();

  return {
    cartItems,
    isPending,
    error,
  };
}
