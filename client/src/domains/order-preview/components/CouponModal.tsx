import styled from '@emotion/styled';

import {Button, ErrorState, LoadingState, Typo, theme} from '../../../design-system/index.js';
import type {Coupon, CouponId} from '../../coupon/domain/types.js';
import {CouponModalItem} from './CouponModalItem.js';

const MAX_COUPON_COUNT = 2;

type CouponsStatus = 'loading' | 'success' | 'error';

interface CouponModalProps {
  coupons: Coupon[];
  discountAmount: number;
  errorMessage: string;
  selectedCouponIds: CouponId[];
  status: CouponsStatus;
  onApply: () => void;
  onChangeSelectedCouponIds: (couponIds: CouponId[]) => void;
  onClose: () => void;
  onRetry: () => void;
}

export const CouponModal = ({
  coupons,
  discountAmount,
  errorMessage,
  selectedCouponIds,
  status,
  onApply,
  onChangeSelectedCouponIds,
  onClose,
  onRetry,
}: CouponModalProps) => {
  const toggleCoupon = (coupon: Coupon) => {
    const isSelected = selectedCouponIds.includes(coupon.couponId);

    if (isSelected) {
      onChangeSelectedCouponIds(selectedCouponIds.filter((couponId) => couponId !== coupon.couponId));
      return;
    }

    if (coupon.disabled) return;
    if (selectedCouponIds.length >= MAX_COUPON_COUNT) return;

    onChangeSelectedCouponIds([...selectedCouponIds, coupon.couponId]);
  };

  return (
    <Overlay>
      <Panel>
        <Header>
          <Title as='h2' variant='title' weight='bold'>
            쿠폰을 선택해 주세요
          </Title>
          <CloseButton type='button' onClick={onClose}>
            ×
          </CloseButton>
        </Header>

        <Notice as='p' variant='caption' weight='medium'>
          ⓘ 쿠폰은 최대 {MAX_COUPON_COUNT}개까지 사용할 수 있습니다.
        </Notice>

        {status === 'loading' && <LoadingState />}
        {status === 'error' && <ErrorState message={errorMessage} onAction={onRetry} />}
        {status === 'success' && (
          <>
            <CouponList>
              {coupons.map((coupon) => {
                const isSelected = selectedCouponIds.includes(coupon.couponId);
                const isSelectionFull = selectedCouponIds.length >= MAX_COUPON_COUNT;
                const isDisabled = !isSelected && (coupon.disabled || isSelectionFull);

                return (
                  <CouponModalItem
                    key={coupon.couponId}
                    checked={isSelected}
                    coupon={coupon}
                    disabled={isDisabled}
                    onChange={() => toggleCoupon(coupon)}
                  />
                );
              })}
            </CouponList>

            <ApplyButton onClick={onApply}>{getApplyButtonText(discountAmount)}</ApplyButton>
          </>
        )}
      </Panel>
    </Overlay>
  );
};

function getApplyButtonText(discountAmount: number) {
  return `총 ${discountAmount.toLocaleString('ko-KR')}원 할인 쿠폰 사용하기`;
}

const Overlay = styled.div`
  position: fixed;
  z-index: 20;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  max-width: 430px;
  margin: 0 auto;

  background: rgba(0, 0, 0, 0.35);
`;

const Panel = styled.div`
  width: 100%;
  max-width: 382px;
  max-height: calc(100dvh - 48px);
  overflow-y: auto;
  padding: 24px;
  border-radius: ${theme.radius[8]};
  background: ${theme.colors.white};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const Title = styled(Typo)``;

const CloseButton = styled.button`
  border: 0;
  background: transparent;
  color: ${theme.colors.black};
  cursor: pointer;
  font: inherit;
  font-size: 28px;
  line-height: 1;
`;

const Notice = styled(Typo)`
  margin: 28px 0 0;
`;

const CouponList = styled.ul`
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
`;

const ApplyButton = styled(Button)`
  width: 100%;
  margin-top: 20px;
  border-radius: 5px;
`;
