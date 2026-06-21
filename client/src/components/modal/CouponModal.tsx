import { useState } from "react";
import { CouponData, OrderData } from "../../type/types";
import CouponList from "./CouponList";
import styled from "styled-components";

interface Props {
  orderId: number;
  couponData: CouponData[];
  orderData: OrderData;
  updateAppliedCoupon: (orderId: number, couponIds: number[]) => Promise<void>;
  onClose: () => void;
}

export default function CouponModal({
  orderId,
  couponData,
  orderData,
  updateAppliedCoupon,
  onClose,
}: Props) {
  // 체크박스로 표시중인 쿠폰 ID 목록/ 초기값 = 현재 적용되어있는 쿠폰
  const [selectedIds, setSelectedIds] = useState<number[]>(
    orderData.appliedCoupon,
  );
  // 쿠폰 적용 버튼에 표시할 예상 할인액
  const [expectedDiscount, setExpectedDiscount] = useState<number>(
    orderData.couponDiscountAmount,
  );

  const handleToggle = async (couponId: number) => {
    const nextSelectedIds = selectedIds.includes(couponId)
      ? selectedIds.filter((id) => id !== couponId)
      : [...selectedIds, couponId];

    if (nextSelectedIds.length > 2) return;
    setSelectedIds(nextSelectedIds);

    const key = [...nextSelectedIds].sort((a, b) => a - b).join(",");
    setExpectedDiscount(orderData.couponCombinations[key] ?? 0);
  };

  const isDisabled = (coupon: CouponData): boolean => {
    if (!coupon.isAvailable) return true;
    if (selectedIds.length >= 2 && !selectedIds.includes(coupon.couponId))
      return true;
    if (selectedIds.includes(2) && coupon.couponId !== 2) return true;
    if (
      coupon.couponId === 2 &&
      selectedIds.length > 0 &&
      !selectedIds.includes(2)
    )
      return true;
    return false;
  };

  const handleClose = () => {
    setSelectedIds(orderData.appliedCoupon);
    onClose();
  };

  const handleApply = async () => {
    await updateAppliedCoupon(orderId, selectedIds);
    onClose();
  };

  return (
    <Overlay>
      <Container>
        <TopSection>
          <Text>쿠폰을 선택해 주세요</Text>
          <button onClick={handleClose}>
            <img src="/Xbutton.png" />
          </button>
        </TopSection>
        <CouponList
          couponData={couponData}
          selectedIds={selectedIds}
          onToggle={handleToggle}
          isDisabled={isDisabled}
        />
        <ApplyButton onClick={handleApply}>
          {expectedDiscount > 0
            ? `총 ${expectedDiscount.toLocaleString()}원 할인 쿠폰 사용하기`
            : "쿠폰 사용하기"}
        </ApplyButton>
      </Container>
    </Overlay>
  );
}

const Overlay = styled.div``;
const Container = styled.div`
  width: 382px;
  height: 614px;
`;
const TopSection = styled.div``;
const Text = styled.p``;
const ApplyButton = styled.button`
  width: 100%;
  height: 52px;
  background: #000;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  border: none;
  cursor: pointer;
`;
