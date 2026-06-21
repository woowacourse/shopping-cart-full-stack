import styled from '@emotion/styled';

import {noticeIconUrl} from '../../../../design-system/assets/icons/index.js';
import {fontWeights, theme, typography} from '../../../../design-system/index.js';
import {FREE_SHIPPING_THRESHOLD} from '../../../../shared/domain/shippingPolicy.js';
import {SummaryLayout, SummaryRow} from '../../../../shared/layout/SummaryLayout.js';
import type {OrderPrice} from '../../api/orderPreviewApi.js';

interface OrderPreviewPriceSummaryProps {
  price: OrderPrice;
}

export const OrderPreviewPriceSummary = ({price}: OrderPreviewPriceSummaryProps) => {
  return (
    <PriceSummary>
      <FreeShippingNotice>
        <NoticeIcon alt='' src={noticeIconUrl} />
        <NoticeText>
          총 주문 금액이 {FREE_SHIPPING_THRESHOLD.toLocaleString('ko-KR')}원 이상일 경우 무료 배송됩니다.
        </NoticeText>
      </FreeShippingNotice>
      <SummaryLayout>
        <SummaryRow left='주문 금액' right={`${price.orderAmount.toLocaleString('ko-KR')}원`} />
        <SummaryRow left='쿠폰 할인 금액' right={getDiscountAmountText(price.totalDiscountAmount)} />
        <SummaryRow left='배송비' right={`${price.shippingFee.toLocaleString('ko-KR')}원`} />
      </SummaryLayout>
      <SummaryLayout>
        <SummaryRow left='총 결제 금액' right={`${price.totalPaymentAmount.toLocaleString('ko-KR')}원`} />
      </SummaryLayout>
    </PriceSummary>
  );
};

const PriceSummary = styled.section`
  margin-top: 34px;
`;

const FreeShippingNotice = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NoticeIcon = styled.img`
  flex: 0 0 auto;
  width: 15px;
  height: 15px;
  object-fit: contain;
`;

const NoticeText = styled.p`
  margin: 0;
  color: ${theme.colors.textPrimary};
  font-size: ${typography.caption.fontSize};
  font-weight: ${fontWeights.medium};
  line-height: ${typography.caption.lineHeight};
`;

function getDiscountAmountText(discountAmount: number) {
  if (discountAmount === 0) return '0원';

  return `-${discountAmount.toLocaleString('ko-KR')}원`;
}
