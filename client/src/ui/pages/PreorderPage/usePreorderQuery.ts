import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { PreorderResponse, Coupon } from "@cart/shared";
import { fetchPreorderApi } from "../../../infrastructure/api/fetchPreorderApi";
import { fetchCouponApi } from "../../../infrastructure/api/fetchCouponApi";
import { findBestCouponCombination } from "../../../domain/couponOptimizer";

export const usePreorderQuery = (preorderId: string | undefined) => {
  const navigate = useNavigate();

  const [preorder, setPreorder] = useState<PreorderResponse | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [initialCouponIds, setInitialCouponIds] = useState<number[]>([]);

  useEffect(() => {
    if (!preorderId) return;

    const loadData = async () => {
      try {
        const [preorderData, couponsData] = await Promise.all([
          fetchPreorderApi.getPreorder(preorderId),
          fetchCouponApi.getCoupons(),
        ]);

        setPreorder(preorderData);
        setCoupons(couponsData);

        const bestCombo = findBestCouponCombination(
          preorderData.items,
          couponsData,
          false,
        );
        setInitialCouponIds(bestCombo.map((c) => c.couponId));
      } catch {
        alert("데이터를 불러오지 못했습니다. 장바구니로 돌아갑니다.");
        navigate("/cart", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [preorderId, navigate]);

  return { preorder, coupons, isLoading, initialCouponIds };
};
