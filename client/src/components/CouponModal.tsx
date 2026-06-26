import styled from '@emotion/styled';
import Checkbox from './ui/Checkbox';
import type { Coupon, CouponStatus, CouponType } from '../types/couponType';

const MAX_SELECTABLE = 2;

const COUPON_CONDITION: Record<CouponType, string> = {
  FIXED5000: '최소 주문 금액: 100,000원',
  BOGO: '동일 상품 3개 구매 시 1개 무료',
  FREESHIPPING: '최소 주문 금액: 50,000원',
  MIRACLESALE: '사용 가능 시간: 오전 4시부터 7시까지',
};

const COUPON_UNAVAILABLE: Record<CouponType, string> = {
  FIXED5000: '최소 주문 금액을 충족하지 않습니다.',
  BOGO: '동일 상품을 3개 이상 담아야 사용할 수 있습니다.',
  FREESHIPPING: '지금은 사용할 수 없는 쿠폰입니다.',
  MIRACLESALE: '지금은 사용 가능 시간이 아닙니다.',
};

interface CouponModalProps {
  coupons: Coupon[];
  couponStatuses: CouponStatus[];
  selectedIds: number[];
  discount: number;
  onToggle: (id: number) => void;
  onClose: () => void;
  onApply: () => void;
}

function CouponModal({
  coupons,
  couponStatuses,
  selectedIds,
  discount,
  onToggle,
  onClose,
  onApply,
}: CouponModalProps) {
  const isAtLimit = selectedIds.length >= MAX_SELECTABLE;
  const isApplicable = (id: number): boolean =>
    couponStatuses.find((status) => status.id === id)?.applicable ?? true;

  return (
    <Dim onClick={onClose}>
      <Sheet onClick={(e) => e.stopPropagation()}>
        <Header>
          <h2 id="modal-title">쿠폰을 선택해 주세요</h2>
          <button id="close-button" onClick={onClose} aria-label="닫기">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </Header>

        <NoticeRow>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 3.33333H7.33333V4.66667H6V3.33333ZM6 6H7.33333V10H6V6ZM6.66667 0C2.98667 0 0 2.98667 0 6.66667C0 10.3467 2.98667 13.3333 6.66667 13.3333C10.3467 13.3333 13.3333 10.3467 13.3333 6.66667C13.3333 2.98667 10.3467 0 6.66667 0ZM6.66667 12C3.72667 12 1.33333 9.60667 1.33333 6.66667C1.33333 3.72667 3.72667 1.33333 6.66667 1.33333C9.60667 1.33333 12 3.72667 12 6.66667C12 9.60667 9.60667 12 6.66667 12Z"
              fill="black"
            />
          </svg>
          <p>쿠폰은 최대 {MAX_SELECTABLE}개까지 사용할 수 있습니다.</p>
        </NoticeRow>

        <CouponList>
          {coupons.map((coupon) => {
            const checked = selectedIds.includes(coupon.id);
            const applicable = isApplicable(coupon.id);
            const disabled = !applicable || (!checked && isAtLimit);
            const condition = COUPON_CONDITION[coupon.type];

            return (
              <CouponItem key={coupon.id} disabled={disabled}>
                <Checkbox
                  checked={checked}
                  onChange={() => {
                    if (disabled) return;
                    onToggle(coupon.id);
                  }}
                  label={coupon.name}
                />
                <CouponMeta>
                  <p>만료일: {coupon.expirationDate}</p>
                  {condition && <p>{condition}</p>}
                  {!applicable && (
                    <p id="unavailable">{COUPON_UNAVAILABLE[coupon.type]}</p>
                  )}
                </CouponMeta>
              </CouponItem>
            );
          })}
        </CouponList>

        <ApplyButton onClick={onApply}>
          총 {discount.toLocaleString()}원 할인 쿠폰 사용하기
        </ApplyButton>
      </Sheet>
    </Dim>
  );
}

export default CouponModal;

const Dim = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  box-sizing: border-box;
  z-index: 100;
`;

const Sheet = styled.div`
  width: 100%;
  max-width: 500px;
  background-color: #ffffff;
  border-radius: 8px;
  box-sizing: border-box;
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  #modal-title {
    font-family: Noto Sans;
    font-weight: 700;
    font-style: Bold;
    font-size: 18px;
    line-height: 18px;
    letter-spacing: 0%;
    vertical-align: middle;
  }

  #close-button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
  }
`;

const NoticeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 1rem;

  p {
    font-family: Noto Sans;
    font-weight: 500;
    font-style: Display Medium;
    font-size: 12px;
    line-height: 15px;
    letter-spacing: 0%;
  }
`;

const CouponList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
  overflow-y: auto;
  flex: 1;
`;

const CouponItem = styled.div<{ disabled: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #0000001a;
  opacity: ${({ disabled }) => (disabled ? 0.35 : 1)};
  transition: opacity 150ms ease;

  /* 쿠폰 이름(Checkbox label) 폰트 강조 */
  span {
    font-family: Noto Sans KR;
    font-weight: 700;
    font-style: Bold;
    font-size: 16px;
    line-height: 100%;
    letter-spacing: 0%;
    vertical-align: middle;
  }
`;

const CouponMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding-left: 2rem;

  p {
    font-family: Noto Sans;
    font-weight: 500;
    font-style: Display Medium;
    font-size: 12px;
    line-height: 15px;
    letter-spacing: 0%;
    color: #00000099;
  }

  #unavailable {
    color: #d32f2f;
  }
`;

const ApplyButton = styled.button`
  width: 100%;
  height: 64px;
  margin-top: 1.5rem;
  background-color: #000000;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  flex-shrink: 0;

  font-family: Noto Sans;
  font-weight: 700;
  font-style: Bold;
  font-size: 16px;
  line-height: 16px;
  letter-spacing: 0%;
  text-align: center;
  vertical-align: middle;
`;
