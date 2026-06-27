import styled from "@emotion/styled";
import type { CouponItem, OrderCoupon } from "../types/order";
import { useCoupon } from "../hooks/useCoupon";
import { Checkbox } from "../common/Checkbox";
import { Spinner } from "../common/Spinner";

interface CouponModalProps {
  orderId: string;
  initialSelectedIds: number[];
  orderTotal: number;
  deliveryFee: number;
  onClose: () => void;
  onApply: (result: { coupons: OrderCoupon[]; orderAmount: number; couponDiscount: number; shippingDiscount: number; totalAmount: number }) => void;
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const ModalCard = styled.div`
  background: #fff;
  border-radius: 12px;
  width: calc(100% - 48px);
  max-width: 480px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Divider = styled.div`
  height: 1px;
  background-color: #eee;
  margin: 0 24px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 16px;
`;

const ModalTitle = styled.span`
  font-size: 18px;
  font-weight: bold;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  color: #333;
`;

const InfoText = styled.p`
  font-size: 12px;
  color: #555;
  padding: 12px 24px;
`;

const CouponList = styled.ul`
  flex: 1;
  overflow-y: auto;
  padding: 0;
  list-style: none;
`;

const CouponItem = styled.li<{ disabled: boolean }>`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 20px 0;
  margin: 0 24px;
  border-top: 1px solid #eee;
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
`;

const CouponInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CouponTitle = styled.span`
  font-size: 16px;
  font-weight: bold;
`;

const CouponDetail = styled.p`
  font-size: 12px;
  color: #555;
`;

const ApplyButton = styled.button`
  width: 100%;
  height: 44px;
  border: none;
  border-radius: 5px;
  background-color: #333;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin: 16px 24px;
  width: calc(100% - 48px);

  &:disabled {
    background-color: #bebebe;
    cursor: not-allowed;
  }
`;

export function CouponModal({
  orderId,
  initialSelectedIds,
  orderTotal,
  deliveryFee,
  onClose,
  onApply,
}: CouponModalProps) {
  const {
    coupons,
    selectedIds,
    loading,
    applying,
    discount,
    toggleSelect,
    applySelected,
  } = useCoupon(orderId, initialSelectedIds, orderTotal, deliveryFee);

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>쿠폰을 선택해 주세요</ModalTitle>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </ModalHeader>
        <Divider />
        <InfoText>ⓘ 쿠폰은 최대 2개까지 사용할 수 있습니다.</InfoText>
        {loading ? (
          <Spinner />
        ) : (
          <CouponList>
            {coupons.map((coupon) => {
              const isSelected = selectedIds.includes(coupon.id);
              const isDisabled = !coupon.isCouponUsable;
              const isMaxed = selectedIds.length >= 2 && !isSelected;

              return (
                <CouponItem key={coupon.id} disabled={isDisabled}>
                  <Checkbox
                    checked={isSelected}
                    onChange={() => {
                      if (!isDisabled && !isMaxed) toggleSelect(coupon.id);
                    }}
                  />
                  <CouponInfo>
                    <CouponTitle>{coupon.title}</CouponTitle>
                    <CouponDetail>
                      만료일:{" "}
                      {new Date(coupon.expirationDate).toLocaleDateString(
                        "ko-KR",
                      )}
                    </CouponDetail>
                    {coupon.minimumAmount && (
                      <CouponDetail>
                        최소 주문 금액: {coupon.minimumAmount.toLocaleString()}
                        원
                      </CouponDetail>
                    )}
                    {coupon.availableTime && (
                      <CouponDetail>
                        사용 가능 시간: {coupon.availableTime.start} ~{" "}
                        {coupon.availableTime.end}
                      </CouponDetail>
                    )}
                  </CouponInfo>
                </CouponItem>
              );
            })}
          </CouponList>
        )}
        <ApplyButton
          onClick={async () => {
            try {
              const result = await applySelected();
              onApply(result);
            } catch {
              alert("쿠폰 적용에 실패했습니다. 다시 시도해 주세요.");
            }
          }}
          disabled={applying}
        >
          총 {discount.toLocaleString()}원 할인 쿠폰 사용하기
        </ApplyButton>
      </ModalCard>
    </Overlay>
  );
}
