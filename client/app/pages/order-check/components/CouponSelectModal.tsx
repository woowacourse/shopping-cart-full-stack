import styled from "@emotion/styled";
import Modal from "../../../commons/components/Modal";
import InfoText from "../../../commons/components/InfoText";
import { Button } from "../../../commons/styles/Button";
import { Coupon as CouponType } from "../types";
import Coupon from "./Coupon";
import Toast from "../../../commons/components/Toast";
import { formatToKoreanPrice } from "../../../commons/utils";
import useCouponSelection from "../hooks/useCouponSelection";

interface Props {
  orderId: string;
  selectedCoupons: string[];
  coupons: CouponType[];
  maxCouponCount: number;
  initialDiscountPrice: number;
  updateOrder: (body: { selected_coupons?: string[] }) => Promise<void>;
  isOpen: boolean;
  onClose: () => void;
}

export default function CouponSelectModal({
  orderId,
  selectedCoupons,
  coupons,
  maxCouponCount,
  initialDiscountPrice,
  updateOrder,
  isOpen,
  onClose,
}: Props) {
  const { localSelected, discountPrice, errorMessage, setErrorMessage, onToggle } =
    useCouponSelection(orderId, selectedCoupons, initialDiscountPrice);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {errorMessage && (
        <Toast message={errorMessage} onClose={() => setErrorMessage(null)} />
      )}
      <Title>쿠폰을 선택해 주세요</Title>
      <InfoText>쿠폰은 최대 {maxCouponCount}개까지 사용할 수 있습니다.</InfoText>
      <CouponList>
        {coupons.map((item: CouponType) => {
          return (
            <Coupon
              key={item.id}
              item={item}
              onToggle={() => onToggle(item)}
              isSelect={localSelected.includes(item.id)}
            />
          );
        })}
      </CouponList>
      <CouponUseButton
        onClick={() => {
          updateOrder({ selected_coupons: localSelected });
          onClose();
        }}
      >
        총 {formatToKoreanPrice(discountPrice)} 할인 쿠폰 사용하기
      </CouponUseButton>
    </Modal>
  );
}

const Title = styled.h2`
  font-weight: 700;
  font-size: 18px;
  margin: 0;
`;

const CouponList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0;
  width: 100%;
  overflow: scroll;
`;

const CouponUseButton = styled(Button)`
  padding: 12px 0;
  border-radius: 5px;
  margin-top: auto;
`;
