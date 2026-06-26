import styled from '@emotion/styled';
import { useState } from 'react';
import Modal from '../Modal';
import CouponItem from './CouponItem';
import infoIcon from '../../assets/info.svg';
import { useQuery } from '../../api/useQuery';
import { getOrderCoupons, updateOrderCoupons } from '../../api/coupon';
import { formatPrice } from '../../utils/formatPrice';
import { useCouponDiscountPreview } from '../../hooks/useCouponDiscountPreview';
import CouponSelectModalSkeleton from './CouponSelectModalSkeleton';

interface CouponSelectModalProps {
  orderId: number;
  onClose: () => void;
  onApplied: () => void;
}

export default function CouponSelectModal({
  orderId,
  onClose,
  onApplied,
}: CouponSelectModalProps) {
  const { data } = useQuery({
    queryFn: () => getOrderCoupons(orderId),
  });

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isApplying, setIsApplying] = useState(false);
  const [initializedData, setInitializedData] = useState(data);

  const {
    discountAmount,
    isLoading: isPreviewLoading,
    isError,
  } = useCouponDiscountPreview({
    orderId,
    selectedIds,
    enabled: !!data,
  });

  if (data && data !== initializedData) {
    setInitializedData(data);
    setSelectedIds(
      data.result.coupons
        .filter((coupon) => coupon.isSelected)
        .map((c) => c.id),
    );
  }

  if (!data) {
    return (
      <Modal isOpen onClose={onClose} title="쿠폰을 선택해 주세요">
        <CouponSelectModalSkeleton />
      </Modal>
    );
  }

  const { coupons, maxSelectableCouponCount } = data.result;

  const handleToggle = (id: number) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((value) => value !== id);
      if (prev.length >= maxSelectableCouponCount) {
        alert(
          `쿠폰은 최대 ${maxSelectableCouponCount}개까지 사용할 수 있습니다.`,
        );
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleApply = async () => {
    try {
      setIsApplying(true);
      await updateOrderCoupons(orderId, selectedIds);
      onApplied();
      onClose();
    } catch (err) {
      if (err instanceof Error) alert(err.message);
    } finally {
      setIsApplying(false);
    }
  };

  const getApplyLabel = () => {
    if (isError) return '오류가 발생했습니다';
    if (isPreviewLoading) return '로딩 중';
    if (discountAmount > 0)
      return `총 ${formatPrice(discountAmount)}원 할인 쿠폰 사용하기`;

    return '쿠폰 적용하기';
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="쿠폰을 선택해 주세요"
      footer={
        <ApplyButton
          type="button"
          onClick={handleApply}
          disabled={isPreviewLoading || isApplying || isError}
        >
          {getApplyLabel()}
        </ApplyButton>
      }
    >
      <InfoBanner>
        <img src={infoIcon} alt="" aria-hidden="true" />
        쿠폰은 최대 {maxSelectableCouponCount}개까지 사용할 수 있습니다.
      </InfoBanner>

      <List>
        {coupons.map((coupon) => (
          <CouponItem
            key={coupon.id}
            coupon={coupon}
            isSelected={selectedIds.includes(coupon.id)}
            onToggle={handleToggle}
          />
        ))}
      </List>
    </Modal>
  );
}

const InfoBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 16px;
  border-bottom: 1px solid #0000001a;
  font-size: 14px;
  font-weight: 500;
  color: #0a0d13;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
`;

const ApplyButton = styled.button`
  width: 100%;
  height: 56px;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  background-color: #333333;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
