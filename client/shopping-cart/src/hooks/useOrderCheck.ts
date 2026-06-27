import { useEffect, useState } from 'react';
import { getOrderCheck } from '../apis/orderCheckApi';
import type { OrderCheck } from '../types';

const useOrderCheck = () => {
  const [order, setOrder] = useState<OrderCheck>();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const loadOrderCheck = async () => {
      try {
        const data = await getOrderCheck();
        setOrder(data);
      } catch (error) {
        console.error(error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrderCheck();
  }, []);

  return { order, setOrder, isLoading, isError };
};

export default useOrderCheck;
