import { useEffect, useState } from 'react';
import { getCoupons, type CouponListResponse } from '../../apis/coupon';

export const useCoupons = () => {
  const [couponData, setCouponData] = useState<CouponListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const fetchedCouponData = await getCoupons();

        setCouponData(fetchedCouponData);
      } catch (error) {
        setError(
          error instanceof Error
            ? error
            : new Error('쿠폰 정보를 불러오지 못했습니다.'),
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  return {
    couponData,
    isLoading,
    error,
  };
};
