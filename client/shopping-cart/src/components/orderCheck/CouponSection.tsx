import { css } from '@emotion/react';
import { useState } from 'react';
import ModalLayout from '../common/Modal';
import InfoNotice from '../common/InfoNotice';
import Checkbox from '../common/buttons/Checkbox';
import CouponApplyButton from '../common/buttons/CouponApplyButton';
import { formatCouponDescription } from '../../utils/coupon';
import { formatPrice } from '../../utils/price';
import type { CouponInfo } from '../../types';

type Props = {
  info?: CouponInfo;
  selectedIds: string[];
  discountAmount: number;
  onLoadCoupons: () => void;
  onToggle: (couponId: string) => void;
  onApply: () => Promise<boolean>;
};

const CouponSection = ({
  info,
  selectedIds,
  discountAmount,
  onLoadCoupons,
  onToggle,
  onApply,
}: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpen = () => {
    setIsModalOpen(true);
    onLoadCoupons();
  };

  const handleApply = async () => {
    const isApplied = await onApply();
    if (isApplied) setIsModalOpen(false);
  };

  return (
    <>
      <CouponApplyButton onClick={handleOpen} />

      <ModalLayout isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="쿠폰을 선택해 주세요">
        <InfoNotice text="쿠폰은 최대 2개까지 사용할 수 있습니다." />

        <ul
          css={css`
            display: flex;
            flex-direction: column;
            flex: 1;
            min-height: 0;
            gap: 12px;
            padding: 0;
            margin: 17px 0 32px;
            list-style: none;
            overflow-y: auto;
          `}
        >
          {info?.coupons.map((coupon) => {
            const isSelected = selectedIds.includes(coupon.couponId);

            return (
              <li
                key={coupon.couponId}
                css={css`
                  display: flex;
                  flex-direction: column;
                  gap: 12px;
                  padding: 12px 0;
                  border-top: 1px solid var(--color-line);
                `}
              >
                <div
                  css={css`
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    gap: 8px;
                  `}
                >
                  <Checkbox
                    isSelected={isSelected}
                    disabled={coupon.disabled}
                    onToggle={() => onToggle(coupon.couponId)}
                  />
                  <p
                    css={css`
                      font: var(--text-subheading);
                      color: ${coupon.disabled ? '#33333366' : 'inherit'};
                    `}
                  >
                    {coupon.couponTitle}
                  </p>
                </div>
                <div
                  css={css`
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                  `}
                >
                  {coupon.description.map((desc) => (
                    <p
                      key={desc.type}
                      css={css`
                        font: var(--text-label);
                        color: ${coupon.disabled ? '#33333366' : 'inherit'};
                      `}
                    >
                      {formatCouponDescription(desc)}
                    </p>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>

        <button
          css={css`
            width: 100%;
            height: 44px;
            flex-shrink: 0;
            justify-content: center;
            align-items: center;
            border-radius: 5px;

            background: #333333;

            cursor: pointer;
          `}
          onClick={handleApply}
        >
          <p
            css={css`
              font: var(--text-button);
              color: #ffffff;
            `}
          >
            총 {formatPrice(discountAmount)}원 할인 쿠폰 사용하기
          </p>
        </button>
      </ModalLayout>
    </>
  );
};

export default CouponSection;
