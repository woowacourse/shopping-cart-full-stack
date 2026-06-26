import { useState } from "react";
import styled from "@emotion/styled";
import checked from "../../../assets/checked.svg";
import unchecked from "../../../assets/unchecked.svg";
import { MAX_COUPON_COUNT } from "../constants/constant";
import { getCouponDescriptions } from "../domain/couponDescription";
import { useOrderCalculation } from "../hooks/useOrderCalculation";
import type { CalculationItem, Coupon } from "../types";

interface Props {
  coupons: Coupon[];
  isLoading: boolean;
  error: string;
  items: CalculationItem[];
  isRemoteArea: boolean;
  selectedCouponIds: number[];
  onApply: (couponIds: number[]) => void;
  onClose: () => void;
}

/**
 * 쿠폰을 최대 2개까지 고르는 모달.
 * 고르는 동안의 임시 선택(draft)을 서버에 보내 실시간 할인 금액을 받아 보여주고,
 * 사용하기를 누르면 확정한다.
 */
export default function CouponModal({
  coupons,
  isLoading,
  error,
  items,
  isRemoteArea,
  selectedCouponIds,
  onApply,
  onClose,
}: Props) {
  const [draftIds, setDraftIds] = useState<number[]>(selectedCouponIds);
  const { calculation } = useOrderCalculation(items, draftIds, isRemoteArea);

  const isChecked = (id: number) => draftIds.includes(id);

  const isAvailable = (id: number) =>
    !calculation || calculation.availableCouponIds.includes(id);

  const isDisabled = (id: number) =>
    !isAvailable(id) || (draftIds.length >= MAX_COUPON_COUNT && !isChecked(id));

  const toggle = (id: number) => {
    if (isChecked(id)) {
      setDraftIds(draftIds.filter((couponId) => couponId !== id));
      return;
    }
    if (draftIds.length < MAX_COUPON_COUNT) {
      setDraftIds([...draftIds, id]);
    }
  };

  const applyRecommended = () => {
    if (calculation) setDraftIds(calculation.recommendedCouponIds);
  };

  const totalDiscount = calculation?.totalDiscount ?? 0;

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Head>
          <h3>쿠폰을 선택해 주세요</h3>
          <button onClick={onClose} aria-label="닫기">
            ✕
          </button>
        </Head>

        <InfoRow>
          <span>
            ⓘ 쿠폰은 최대 {MAX_COUPON_COUNT}개까지 사용할 수 있습니다.
          </span>
          <RecommendButton onClick={applyRecommended}>
            최대 할인 적용
          </RecommendButton>
        </InfoRow>

        {isLoading ? (
          <StatusMessage role="status">
            쿠폰 목록을 불러오는 중입니다…
          </StatusMessage>
        ) : error ? (
          <StatusMessage role="alert">{error}</StatusMessage>
        ) : (
          <CouponList>
            {coupons.map((coupon) => (
              <CouponItem key={coupon.id} disabled={isDisabled(coupon.id)}>
                <input
                  type="checkbox"
                  checked={isChecked(coupon.id)}
                  disabled={isDisabled(coupon.id)}
                  onChange={() => toggle(coupon.id)}
                  aria-label={coupon.name}
                />
                <CouponInfo>
                  <strong>{coupon.name}</strong>
                  {getCouponDescriptions(coupon).map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </CouponInfo>
              </CouponItem>
            ))}
          </CouponList>
        )}

        <ApplyButton onClick={() => onApply(draftIds)}>
          총 {totalDiscount.toLocaleString()}원 할인 쿠폰 사용하기
        </ApplyButton>
      </Modal>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const Modal = styled.div`
  width: 90%;
  max-width: 360px;
  max-height: 80vh;
  overflow-y: auto;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 12px;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Head = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    font-family: "Noto Sans", sans-serif;
    font-weight: 700;
    font-size: 18px;
    color: rgba(0, 0, 0, 1);
  }

  button {
    border: none;
    background: none;
    font-size: 16px;
    cursor: pointer;
    color: rgba(10, 13, 19, 1);
  }
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;

  span {
    font-family: "Noto Sans", sans-serif;
    font-weight: 500;
    font-size: 12px;
    color: rgba(10, 13, 19, 0.7);
  }
`;

const RecommendButton = styled.button`
  flex-shrink: 0;
  padding: 4px 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 1);
  cursor: pointer;
  font-family: "Noto Sans", sans-serif;
  font-weight: 500;
  font-size: 12px;
  color: rgba(10, 13, 19, 1);
`;

const StatusMessage = styled.p`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin: 0;
  padding: 32px 0;
  text-align: center;
  font-family: "Noto Sans", sans-serif;
  font-weight: 500;
  font-size: 13px;
  color: rgba(10, 13, 19, 0.7);
`;

const CouponList = styled.div`
  display: flex;
  flex-direction: column;
`;

const CouponItem = styled.label<{ disabled: boolean }>`
  display: flex;
  flex-direction: row;
  gap: 12px;
  padding: 16px 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};

  input {
    appearance: none;
    -webkit-appearance: none;
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    margin: 0;
    cursor: inherit;

    background-image: url("${unchecked}");
    background-size: 24px 24px;
    background-position: center;
    background-repeat: no-repeat;

    &:checked {
      background-image: url("${checked}");
    }
  }
`;

const CouponInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  strong {
    font-family: "Noto Sans", sans-serif;
    font-weight: 700;
    font-size: 14px;
    color: rgba(0, 0, 0, 1);
  }

  span {
    font-family: "Noto Sans", sans-serif;
    font-weight: 500;
    font-size: 12px;
    color: rgba(10, 13, 19, 0.7);
  }
`;

const ApplyButton = styled.button`
  height: 52px;
  border: none;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 1);
  color: rgba(255, 255, 255, 1);
  cursor: pointer;
  font-family: "Noto Sans", sans-serif;
  font-weight: 700;
  font-size: 14px;
`;
