import { useEffect, useState } from 'react';
import { getCouponsDiscount } from '../api/coupon';

interface UseCouponDiscountPreviewOptions {
  orderId: number;
  selectedIds: number[];
  enabled: boolean;
}

export const useCouponDiscountPreview = ({
  orderId,
  selectedIds,
  enabled,
}: UseCouponDiscountPreviewOptions) => {
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    setIsLoading(true);
    getCouponsDiscount(orderId, selectedIds)
      .then((res) => {
        if (!cancelled) setDiscountAmount(res.result.discountAmount);
      })
      .catch(() => {
        if (!cancelled) setIsError(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [orderId, selectedIds, enabled]);

  return { discountAmount, isLoading, isError };
};
