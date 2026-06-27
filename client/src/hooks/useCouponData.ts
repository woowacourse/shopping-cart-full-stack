import { useEffect, useState } from "react";
import { getCoupons } from "../apis/coupon.api";
import type {
  CouponRequestDto,
  CouponResponseDto,
} from "../apis/coupon.api.dto";
import { getCouponRequestDto } from "../storage/order.storage";

const useCouponData = () => {
  const [data, setData] = useState<CouponResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCoupons = async (): Promise<void> => {
      setError(null);

      try {
        const requestDto: CouponRequestDto = getCouponRequestDto();
        const response = await getCoupons(requestDto);
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

    fetchCoupons();
  }, []);

  return { data, loading, error };
};

export default useCouponData;
