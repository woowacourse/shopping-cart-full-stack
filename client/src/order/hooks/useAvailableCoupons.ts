import { useEffect, useState } from 'react';
import {
  getAvailableCoupons,
  type AvailableCouponListResponse,
} from '../../apis/orderSheet';

export const useAvailableCoupons = (orderSheetId: string) => {
  const [availableCouponData, setAvailableCouponData] =
    useState<AvailableCouponListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAvailableCoupons = async () => {
      try {
        const fetchedAvailableCouponData =
          await getAvailableCoupons(orderSheetId);

        setAvailableCouponData(fetchedAvailableCouponData);
      } catch (error) {
        setError(
          error instanceof Error
            ? error
            : new Error('사용 가능한 쿠폰 정보를 불러오지 못했습니다.'),
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailableCoupons();
  }, [orderSheetId]);

  return { availableCouponData, isLoading, error };
};
