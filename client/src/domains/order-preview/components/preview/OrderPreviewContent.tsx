import styled from '@emotion/styled';

import {fontWeights, theme, typography} from '../../../../design-system/index.js';
import type {Preorder} from '../../../preorder/domain/types.js';
import type {BenefitItem, OrderPrice} from '../../domain/types.js';
import {OrderPreviewPriceSummary} from './OrderPreviewPriceSummary.js';
import {OrderPreviewProductList} from './OrderPreviewProductList.js';
import {OrderPreviewShippingSection} from './OrderPreviewShippingSection.js';

interface OrderPreviewContentProps {
  isRemoteArea: boolean;
  benefitItems: BenefitItem[];
  price: OrderPrice;
  preorder: Preorder;
  onChangeRemoteArea: (isRemoteArea: boolean) => void;
  onOpenCouponModal: () => void;
}

export const OrderPreviewContent = ({
  isRemoteArea,
  benefitItems,
  price,
  preorder,
  onChangeRemoteArea,
  onOpenCouponModal,
}: OrderPreviewContentProps) => {
  return (
    <>
      <OrderPreviewProductList benefitItems={benefitItems} items={preorder.items} />

      <CouponButton type='button' onClick={onOpenCouponModal}>
        쿠폰 적용
      </CouponButton>

      <OrderPreviewShippingSection isRemoteArea={isRemoteArea} onChangeRemoteArea={onChangeRemoteArea} />
      <OrderPreviewPriceSummary price={price} />
    </>
  );
};

const CouponButton = styled.button`
  width: 100%;
  height: 48px;
  margin-top: 12px;
  border: 1px solid ${theme.colors.gray300};
  border-radius: ${theme.radius[4]};
  background: ${theme.colors.white};
  color: ${theme.colors.gray900};
  cursor: pointer;
  font: inherit;
  font-size: ${typography.body.fontSize};
  font-weight: ${fontWeights.bold};
  line-height: ${typography.body.lineHeight};
`;
