import { useEffect, useState } from 'react';
import {
  getOrderSheet,
  type OrderSheet,
  updateOrderSheetCoupons,
  updateShippingArea as updateOrderSheetShippingArea,
} from '../apis/orderSheet';

export const useOrderSheet = (orderSheetId: string | undefined) => {
  const [orderSheet, setOrderSheet] = useState<OrderSheet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!orderSheetId) return;

    const fetchOrderSheet = async () => {
      try {
        const fetchedOrderSheet = await getOrderSheet(orderSheetId);

        setOrderSheet(fetchedOrderSheet);
      } catch (error) {
        setError(
          error instanceof Error
            ? error
            : new Error('주문 정보를 불러오지 못했습니다.'),
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderSheet();
  }, [orderSheetId]);

  const updateShippingArea = async (isRemoteShippingArea: boolean) => {
    if (!orderSheetId) return false;

    await updateOrderSheetShippingArea(orderSheetId, isRemoteShippingArea);

    setOrderSheet((previousOrderSheet) =>
      previousOrderSheet
        ? { ...previousOrderSheet, isRemoteShippingArea }
        : previousOrderSheet,
    );
  };

  const updateCoupons = async (selectedCouponIds: string[]) => {
    if (!orderSheetId) return false;

    await updateOrderSheetCoupons(orderSheetId, selectedCouponIds);

    setOrderSheet((previousOrderSheet) =>
      previousOrderSheet
        ? { ...previousOrderSheet, selectedCouponIds }
        : previousOrderSheet,
    );
  };

  return { orderSheet, isLoading, error, updateShippingArea, updateCoupons };
};
