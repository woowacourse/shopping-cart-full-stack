import { useState, useEffect } from 'react';
import type { Cart, FetchCart } from '../types';

const useCart = (fetchCart: FetchCart) => {
  const [cart, setCart] = useState<Cart>();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const loadCartInfo = async () => {
      try {
        const data = await fetchCart();
        setCart(data);
      } catch (error) {
        console.error(error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadCartInfo();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { cart, setCart, isLoading, isError };
};

export default useCart;
