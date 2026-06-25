import React from "react";
import { CouponData } from "../../type/types";
import CouponItem from "./CouponItem";
import styled from "styled-components";

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
    <CouponListWrapper>
      {couponData.map((coupon) => (
        <CouponItem
          key={coupon.couponId}
          couponData={coupon}
          isChecked={selectedIds.includes(coupon.couponId)}
          isDisabled={isDisabled(coupon)}
          onToggle={onToggle}
        />
      ))}
    </CouponListWrapper>
  );
}
const CouponListWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
`;
