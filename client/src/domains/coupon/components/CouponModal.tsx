import styled from '@emotion/styled';

import {noticeIconUrl} from '../../../design-system/assets/icons/index.js';
import {Button, ErrorState, LoadingState, Typo, theme} from '../../../design-system/index.js';
import {MAX_SELECTED_COUPON_COUNT, getCouponItemDisabled, getNextSelectedCouponIds} from '../domain/couponSelection.js';
import type {Coupon, CouponId} from '../domain/types.js';
import {CouponModalItem} from './CouponModalItem.js';

type CouponsStatus = 'loading' | 'success' | 'error';

interface CouponModalState {
  coupons: Coupon[];
  discountAmount: number;
  errorActionText: string;
  errorMessage: string;
  selectedCouponIds: CouponId[];
  status: CouponsStatus;
}

interface CouponModalActions {
  onApply: () => void;
  onChangeSelectedCouponIds: (couponIds: CouponId[]) => void;
  onClose: () => void;
  onRetry: () => void;
}

interface CouponModalProps {
  actions: CouponModalActions;
  state: CouponModalState;
}

export const CouponModal = ({actions, state}: CouponModalProps) => {
  return (
    <Overlay>
      <Panel>
        <CouponModalHeader onClose={actions.onClose} />
        <CouponModalNotice />
        <CouponModalContent actions={actions} state={state} />
      </Panel>
    </Overlay>
  );
};

interface CouponModalHeaderProps {
  onClose: () => void;
}

const CouponModalHeader = ({onClose}: CouponModalHeaderProps) => {
  return (
    <Header>
      <Typo as='h2' variant='title' weight='bold'>
        쿠폰을 선택해 주세요
      </Typo>
      <CloseButton type='button' onClick={onClose}>
        ×
      </CloseButton>
    </Header>
  );
};

const CouponModalNotice = () => {
  return (
    <Notice>
      <NoticeIcon alt='' src={noticeIconUrl} />
      <NoticeText as='p' variant='caption' weight='medium'>
        쿠폰은 최대 {MAX_SELECTED_COUPON_COUNT}개까지 사용할 수 있습니다.
      </NoticeText>
    </Notice>
  );
};

interface CouponModalContentProps {
  actions: CouponModalActions;
  state: CouponModalState;
}

const CouponModalContent = ({actions, state}: CouponModalContentProps) => {
  if (state.status === 'loading') {
    return <LoadingState />;
  }

  if (state.status === 'error') {
    return <ErrorState actionText={state.errorActionText} message={state.errorMessage} onAction={actions.onRetry} />;
  }

  return (
    <>
      <CouponModalList
        coupons={state.coupons}
        selectedCouponIds={state.selectedCouponIds}
        onChangeSelectedCouponIds={actions.onChangeSelectedCouponIds}
      />
      <ApplyButton onClick={actions.onApply}>{getApplyButtonText(state.discountAmount)}</ApplyButton>
    </>
  );
};

interface CouponModalListProps {
  coupons: Coupon[];
  selectedCouponIds: CouponId[];
  onChangeSelectedCouponIds: (couponIds: CouponId[]) => void;
}

const CouponModalList = ({coupons, selectedCouponIds, onChangeSelectedCouponIds}: CouponModalListProps) => {
  const toggleCoupon = (coupon: Coupon) => {
    onChangeSelectedCouponIds(getNextSelectedCouponIds({coupon, selectedCouponIds}));
  };

  return (
    <CouponList>
      {coupons.map((coupon) => (
        <CouponModalListItem
          key={coupon.couponId}
          coupon={coupon}
          selectedCouponIds={selectedCouponIds}
          onChange={() => toggleCoupon(coupon)}
        />
      ))}
    </CouponList>
  );
};

interface CouponModalListItemProps {
  coupon: Coupon;
  selectedCouponIds: CouponId[];
  onChange: () => void;
}

const CouponModalListItem = ({coupon, selectedCouponIds, onChange}: CouponModalListItemProps) => {
  const checked = selectedCouponIds.includes(coupon.couponId);
  const disabled = getCouponItemDisabled({coupon, selectedCouponIds});

  return <CouponModalItem checked={checked} coupon={coupon} disabled={disabled} onChange={onChange} />;
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

const CloseButton = styled.button`
  border: 0;
  background: transparent;
  color: ${theme.colors.black};
  cursor: pointer;
  font: inherit;
  font-size: 28px;
  line-height: 1;
`;

const Notice = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 28px 0 0;
`;

const NoticeIcon = styled.img`
  flex: 0 0 auto;

  width: 15px;
  height: 15px;
  object-fit: contain;
`;

const NoticeText = styled(Typo)`
  flex: 1;
  min-width: 0;
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
