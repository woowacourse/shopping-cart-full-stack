import styled from 'styled-components';
import { Notice } from '../../../shared/styles/common';
import type { ReactNode } from 'react';
import { useCouponsContext } from '../context/CouponProvider';
import { Coupon } from './Coupon';
import { formatDate } from '../utils/formatDate';

export const CouponModal = ({ children }: { children: ReactNode }) => {
  return (
    <Backdrop>
      <Dialog role="dialog">{children}</Dialog>
    </Backdrop>
  );
};

const CouponModalHeader = ({ onClose }: { onClose: () => void }) => {
  return (
    <Header>
      <Title id="coupon-modal-title">쿠폰을 선택해 주세요</Title>
      <CloseButton type="button" onClick={onClose}>
        ×
      </CloseButton>
    </Header>
  );
};

const CouponModalNotice = () => {
  return <Notice>쿠폰은 최대 2개까지 사용할 수 있습니다.</Notice>;
};

const CouponModalList = () => {
  const { data, isLoading, error, selectedCouponIds, toggleCoupon } =
    useCouponsContext();

  if (isLoading) return <div>쿠폰을 불러오는 중입니다.</div>;
  if (error) return <div>{error.message}</div>;
  if (!data) return null;

  return (
    <Content>
      {data.couponList.map((coupon) => (
        <Coupon key={coupon.couponId} disabled={coupon.isDisabled}>
          <Coupon.Checkbox
            type="checkbox"
            disabled={coupon.isDisabled}
            checked={selectedCouponIds.includes(coupon.couponId)}
            onChange={() => toggleCoupon(coupon.couponId)}
          />
          <Coupon.Name>{coupon.couponName}</Coupon.Name>
          <Coupon.Expiration>
            만료일: {formatDate(coupon.couponExpiration)}
          </Coupon.Expiration>
          <Coupon.Description>{coupon.couponDescription}</Coupon.Description>
        </Coupon>
      ))}
    </Content>
  );
};

const CouponModalApplyButton = ({
  onClose,
  onRefresh,
}: {
  onClose: () => void;
  onRefresh: () => void;
}) => {
  const { preview, applySelectedCoupons, couponActionError } =
    useCouponsContext();

  const handleApply = async () => {
    const succeeded = await applySelectedCoupons();

    if (succeeded) {
      onClose();
      onRefresh();
    }
  };

  return (
    <div>
      {couponActionError && (
        <ErrorMessage role="alert">{couponActionError.message}</ErrorMessage>
      )}
      <ApplyButton type="button" onClick={handleApply}>
        총 {(preview?.totalDiscountPrice ?? 0).toLocaleString()}원 할인 쿠폰
        사용하기
      </ApplyButton>
    </div>
  );
};

CouponModal.Header = CouponModalHeader;
CouponModal.Notice = CouponModalNotice;
CouponModal.List = CouponModalList;
CouponModal.ApplyButton = CouponModalApplyButton;

const Backdrop = styled.div`
  position: absolute;
  z-index: 1000;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 24px;
  background-color: rgb(0 0 0 / 45%);
  backdrop-filter: blur(2px);
`;

const Dialog = styled.div`
  display: flex;
  flex-direction: column;
  width: 350px;
  max-height: min(760px, calc(100dvh - 48px));
  padding: 32px;
  border-radius: 10px;

  background-color: #ffffff;
  box-shadow: 0 20px 60px rgb(0 0 0 / 20%);
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
`;

const Title = styled.h2`
  margin: 0;

  color: #111111;
  font-size: 22px;
  font-weight: 800;
`;

const CloseButton = styled.button`
  flex: none;

  padding: 0;
  border: 0;

  background: transparent;
  color: #111111;
  font-size: 30px;
  font-weight: 300;
  line-height: 1;
  cursor: pointer;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 280px;
  overflow-y: auto;
`;

const ApplyButton = styled.button`
  flex: none;

  width: 100%;
  margin-top: 24px;
  padding: 16px;
  border: 0;
  border-radius: 8px;

  background-color: #333333;
  color: #ffffff;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
`;

const ErrorMessage = styled.p`
  margin: 0 0 8px;

  color: #c62828;
  font-size: 13px;
  font-weight: 600;
  text-align: center;
`;
