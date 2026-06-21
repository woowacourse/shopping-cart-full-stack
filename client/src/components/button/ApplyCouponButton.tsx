import { useState } from "react";
import styled from "styled-components";
import { CouponData, OrderData } from "../../type/types";
import CouponModal from "../modal/CouponModal";

interface Props {
  orderId: number;
  couponData: CouponData[];
  orderData: OrderData;
  updateAppliedCoupon: (orderId: number, couponIds: number[]) => Promise<void>;
}

export default function ApplyCouponButton({
  orderId,
  couponData,
  orderData,
  updateAppliedCoupon,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>쿠폰 적용</Button>
      {isOpen && (
        <CouponModal
          orderId={orderId}
          couponData={couponData}
          orderData={orderData}
          updateAppliedCoupon={updateAppliedCoupon}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

const Button = styled.button`
  width: 100%;
  height: 48px;
  font-size: 14px;
  font-weight: 700;
  border: 1px solid #000;
  background-color: #fff;
  cursor: pointer;
`;
