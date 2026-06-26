import styled from '@emotion/styled';
import { useState } from 'react';
import NoticeIcon from '../../Icons/NoticeIcon';
import { requestCouponDiscountPreview } from '../../apis/orderSheet';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { useAvailableCoupons } from '../hooks/useAvailableCoupons';
import { useCoupons } from '../hooks/useCoupons';
import CouponContent from './CouponContent';
import CouponItem from './CouponItem';

interface CouponModalProps {
  onApply: (selectedCouponIds: string[]) => void;
  onClose: () => void;
  initialDiscountAmount: number;
  initialSelectedCouponIds: string[];
  orderSheetId: string;
}

type CouponStatus = 'selected' | 'available' | 'unavailable' | 'limit-reached';

const CouponModal = ({
  onApply,
  onClose,
  initialDiscountAmount,
  initialSelectedCouponIds,
  orderSheetId,
}: CouponModalProps) => {
  const {
    couponData,
    isLoading: isCouponLoading,
    error: couponError,
  } = useCoupons();
  const {
    availableCouponData,
    isLoading: isAvailableCouponLoading,
    error: availableCouponError,
  } = useAvailableCoupons(orderSheetId);
  const [selectedCouponIds, setSelectedCouponIds] = useState(
    initialSelectedCouponIds,
  );
  const [discountAmount, setDiscountAmount] = useState(initialDiscountAmount);

  const availableCouponIds = new Set(
    availableCouponData?.coupons.map(({ id }) => id) ?? [],
  );

  const getCouponStatus = (
    couponId: string,
    currentSelectedCouponIds = selectedCouponIds,
  ): CouponStatus => {
    if (currentSelectedCouponIds.includes(couponId)) {
      return 'selected';
    }

    if (!availableCouponIds.has(couponId)) {
      return 'unavailable';
    }

    if (currentSelectedCouponIds.length >= (couponData?.maxCouponCount ?? 0)) {
      return 'limit-reached';
    }

    return 'available';
  };

  const handleCouponToggle = async (couponId: string) => {
    const status = getCouponStatus(couponId);

    if (status !== 'selected' && status !== 'available') return;

    const nextSelectedCouponIds =
      status === 'selected'
        ? selectedCouponIds.filter((id) => id !== couponId)
        : [...selectedCouponIds, couponId];

    try {
      const preview = await requestCouponDiscountPreview(
        orderSheetId,
        nextSelectedCouponIds,
      );

      setSelectedCouponIds(nextSelectedCouponIds);
      setDiscountAmount(preview.discountAmount);
    } catch {
      alert('쿠폰 할인 금액을 계산하지 못했습니다.');
    }
  };

  return (
    <Modal isOpen onClose={onClose}>
      <Modal.Header>
        <Modal.Title>쿠폰을 선택해 주세요</Modal.Title>
        <Modal.CloseButton />
      </Modal.Header>

      <Modal.Body>
        <CouponContent
          isLoading={isCouponLoading || isAvailableCouponLoading}
          error={couponError ?? availableCouponError}
        >
          {couponData && (
            <>
              <CouponNotice>
                <NoticeIcon />
                쿠폰은 최대 {couponData.maxCouponCount}개까지 사용할 수
                있습니다.
              </CouponNotice>

              <CouponList>
                {couponData.coupons.map((coupon) => {
                  const status = getCouponStatus(coupon.id);

                  return (
                    <CouponItem
                      key={coupon.id}
                      coupon={coupon}
                      checked={status === 'selected'}
                      disabled={
                        status === 'unavailable' || status === 'limit-reached'
                      }
                      onToggle={() => handleCouponToggle(coupon.id)}
                    />
                  );
                })}
              </CouponList>
            </>
          )}
        </CouponContent>
      </Modal.Body>

      <Modal.Footer>
        <PreviewButton
          type="button"
          fullWidth
          onClick={() => onApply(selectedCouponIds)}
        >
          총 {discountAmount.toLocaleString()}원 할인 쿠폰 사용하기
        </PreviewButton>
      </Modal.Footer>
    </Modal>
  );
};

const CouponNotice = styled.p`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin: 0;
  font-size: 0.75rem;
`;

const CouponList = styled.ul`
  margin: 0.75rem 0 0;
  padding: 0;
`;

const PreviewButton = styled(Button)`
  width: 100%;
  max-width: 20rem;
  height: 2.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0 1rem;
  border-radius: 0.3rem;
  background-color: #333333;
`;

export default CouponModal;
