import React from "react";
import { CouponData } from "../../type/types";
import CouponItem from "./CouponItem";

interface Props {
  couponData: CouponData[];
  selectedIds: number[];
  onToggle: (couponId: number) => void;
  isDisabled: (coupon: CouponData) => boolean;
}
export default function CouponList({
  couponData,
  selectedIds,
  onToggle,
  isDisabled,
}: Props) {
  return (
    <div>
      {couponData.map((coupon) => (
        <CouponItem
          key={coupon.couponId}
          couponData={coupon}
          isChecked={selectedIds.includes(coupon.couponId)}
          isDisabled={isDisabled(coupon)}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
