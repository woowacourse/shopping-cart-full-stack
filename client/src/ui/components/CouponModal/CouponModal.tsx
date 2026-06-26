import { validateCoupon } from "@cart/shared";
import type { Coupon, OrderReceipt, PreorderItem } from "@cart/shared";
import infoIcon from "../../../assets/InfoIcon.svg";
import { Checkbox } from "../../components/Checkbox/Checkbox";

import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalInfoText,
  IconImage,
  CouponListWrapper,
  CouponItemWrapper,
  CouponInfoWrapper,
  CouponName,
  CouponDetail,
  ModalApplyButton,
} from "./CouponModal.styles";

interface CouponModalProps {
  isOpen: boolean;
  coupons: Coupon[];
  preorderItems: PreorderItem[];
  tempSelectedCouponIds: number[];
  tempReceipt: OrderReceipt | null;
  onClose: () => void;
  onToggle: (couponId: number) => void;
  onApply: () => void;
}

const formatExpirationDate = (dateString: string) => {
  const [year, month, day] = dateString.split("-");
  return `${year}년 ${Number(month)}월 ${Number(day)}일`;
};

const formatCondition = (condition: Coupon["condition"]) => {
  if (condition.minOrderLimit)
    return `최소 주문 금액: ${condition.minOrderLimit.toLocaleString()}원`;
  if (condition.validTime)
    return `사용 가능 시간: ${condition.validTime.startHour}시부터 ${condition.validTime.endHour}시까지`;
  return "";
};

export const CouponModal = ({
  isOpen,
  coupons,
  preorderItems,
  tempSelectedCouponIds,
  tempReceipt,
  onClose,
  onToggle,
  onApply,
}: CouponModalProps) => {
  if (!isOpen || !tempReceipt) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>쿠폰을 선택해 주세요</ModalTitle>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </ModalHeader>

        <ModalInfoText>
          <IconImage src={infoIcon} alt="info" />
          쿠폰은 최대 2개까지 사용할 수 있습니다.
        </ModalInfoText>

        <CouponListWrapper>
          {coupons.map((coupon) => {
            const isValid = validateCoupon(preorderItems, coupon, new Date());
            const isChecked = tempSelectedCouponIds.includes(coupon.couponId);

            return (
              <CouponItemWrapper
                key={coupon.couponId}
                disabled={!isValid}
                onClick={() => isValid && onToggle(coupon.couponId)}
              >
                <Checkbox checked={isChecked} onChange={() => {}} />
                <CouponInfoWrapper>
                  <CouponName>{coupon.name}</CouponName>
                  {coupon.expirationDate && (
                    <CouponDetail>
                      만료일: {formatExpirationDate(coupon.expirationDate)}
                    </CouponDetail>
                  )}
                  <CouponDetail>
                    {formatCondition(coupon.condition)}
                  </CouponDetail>
                </CouponInfoWrapper>
              </CouponItemWrapper>
            );
          })}
        </CouponListWrapper>

        <ModalApplyButton onClick={onApply}>
          총 {tempReceipt.priceSummary.discountAmount.toLocaleString()}원 할인
          쿠폰 사용하기
        </ModalApplyButton>
      </ModalContent>
    </ModalOverlay>
  );
};
