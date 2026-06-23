import { CouponData, OrderData } from "../../type/types";
import CouponList from "./CouponList";
import styled from "styled-components";
import useCouponModal from "./useCouponModal";

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
  const { selectedIds, expectedDiscount, handleToggle, isDisabled, reset } =
    useCouponModal(orderData, couponData);

  const handleClose = () => {
    reset();
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

          <CloseButton onClick={handleClose}> X </CloseButton>
        </TopSection>
        <Notice>
          <img src="/!_img.jpg" alt="느낌표" />
          <p>쿠폰은 최대 2개까지 사용할 수 있습니다.</p>
        </Notice>
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

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: #00000059;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const Container = styled.div`
  width: 382px;
  height: 614px;
  border-radius: 8px;
  padding: 24px 32px;
  gap: 32px;
  background: #fff;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

const TopSection = styled.div`
  display: flex;

  justify-content: space-between;
  align-items: center;
`;
const Notice = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 16px;
  font-size: 13px;
  color: #555;
  border-bottom: solid 1px #0000001a;
`;

const Text = styled.p`
  font-size: 18px;
  font-weight: 700;
  margin: 0;
`;
const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
`;
const ApplyButton = styled.button`
  width: 318px;
  height: 44px;
  background: #000;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  margin-top: auto;
`;
