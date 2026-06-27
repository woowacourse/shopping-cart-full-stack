import { useEffect, useMemo, useState } from "react";
import type { CouponItem } from "../types/order";
import { getCouponsApi, patchOrderCouponApi } from "../api/orderApi";
import { calculateCouponDiscount } from "../utils/couponUtils";

export function useCoupon(
  orderId: string,
  initialSelectedIds: number[],
  orderTotal: number,
  deliveryFee: number,
) {
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>(initialSelectedIds);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getCouponsApi(orderId)
      .then((data) => {
        if (!mounted) return;
        setCoupons(data);
        setSelectedIds((prev) =>
          prev.filter((id) => data.find((c) => c.id === id)?.isCouponUsable),
        );
      })
      .catch(() => {
        if (!mounted) return;
        // bubble up: keep simple alert in UI
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [orderId]);

  const selectedCoupons = useMemo(
    () => coupons.filter((c) => selectedIds.includes(c.id)),
    [coupons, selectedIds],
  );

  const discount = useMemo(
    () => calculateCouponDiscount(selectedCoupons, orderTotal, deliveryFee),
    [selectedCoupons, orderTotal, deliveryFee],
  );

  function toggleSelect(couponId: number) {
    setSelectedIds((prev) => {
      if (prev.includes(couponId)) return prev.filter((id) => id !== couponId);
      if (prev.length >= 2) return prev;
      return [...prev, couponId];
    });
  }

  async function applySelected() {
    setApplying(true);
    try {
      return await patchOrderCouponApi(orderId, selectedIds);
    } finally {
      setApplying(false);
    }
  }

  return {
    coupons,
    selectedIds,
    loading,
    applying,
    discount,
    toggleSelect,
    applySelected,
  } as const;
}
