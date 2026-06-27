import { useEffect, useState } from "react";
import { getOrderSummary } from "../apis/order.api";
import type { OrderSummaryResponseDto } from "../apis/order.api.dto";
import { getOrderSummaryRequestDto } from "../storage/order.storage";

const useOrderItems = () => {
  const [data, setData] = useState<OrderSummaryResponseDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refetch = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const requestDto = getOrderSummaryRequestDto();
      const response = await getOrderSummary(requestDto);
      setData(response);
    } catch (fetchError) {
      if (fetchError instanceof Error) {
        setError(fetchError);
      } else {
        setError(new Error("Unknown error"));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refetch();
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
  };
};

export default useOrderItems;
