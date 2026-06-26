import { useEffect, useState } from 'react';
import {
  getOrderSheetPricing,
  type OrderSheetPricing,
} from '../apis/orderSheet';

export const useOrderSheetPricing = (orderSheetId: string | undefined) => {
  const [pricing, setPricing] = useState<OrderSheetPricing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [fetchVersion, setFetchVersion] = useState(0);

  useEffect(() => {
    if (!orderSheetId) return;

    const fetchOrderSheetPricing = async () => {
      try {
        const fetchedPricing = await getOrderSheetPricing(orderSheetId);

        setPricing(fetchedPricing);
      } catch (error) {
        setError(
          error instanceof Error
            ? error
            : new Error('결제 금액을 불러오지 못했습니다.'),
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderSheetPricing();
  }, [orderSheetId, fetchVersion]);

  const refetchPricing = () => {
    setIsLoading(true);
    setError(null);
    setFetchVersion((version) => version + 1);
  };

  return { pricing, isLoading, error, refetchPricing };
};
