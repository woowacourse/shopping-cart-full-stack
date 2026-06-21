import styled from '@emotion/styled';

import {noticeIconUrl} from '../../../design-system/assets/icons/index.js';
import {Typo, fontWeights, theme, typography} from '../../../design-system/index.js';
import {FREE_SHIPPING_THRESHOLD} from '../../domain/cartSelectors.js';

type PaymentSummaryProps = {
  selectedOrderAmount: number;
  shippingFee: number;
  totalPrice: number;
};

export const PaymentSummary = ({selectedOrderAmount, shippingFee, totalPrice}: PaymentSummaryProps) => {
  return (
    <SummaryArea aria-label='결제 요약'>
      <FreeShippingNotice>
        <NoticeIcon alt='' aria-hidden='true' src={noticeIconUrl} />
        <NoticeText as='p' variant='caption' weight='medium'>
          총 주문 금액이 {FREE_SHIPPING_THRESHOLD.toLocaleString('ko-KR')}원 이상일 경우 무료 배송됩니다.
        </NoticeText>
      </FreeShippingNotice>
      <SummaryDivider />
      <SummaryRow>
        <SummaryLabel>주문 금액</SummaryLabel>
        <SummaryAmount>{selectedOrderAmount.toLocaleString('ko-KR')}원</SummaryAmount>
      </SummaryRow>
      <SummaryRow>
        <SummaryLabel>배송비</SummaryLabel>
        <SummaryAmount>{shippingFee.toLocaleString('ko-KR')}원</SummaryAmount>
      </SummaryRow>
      <SummaryDivider />
      <TotalSummaryRow>
        <SummaryLabel>총 결제 금액</SummaryLabel>
        <SummaryAmount>{totalPrice.toLocaleString('ko-KR')}원</SummaryAmount>
      </TotalSummaryRow>
    </SummaryArea>
  );
};

const SummaryArea = styled.section`
  margin-top: 32px;
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

const NoticeText = styled(Typo)`
  flex: 1;
  min-width: 0;
`;

const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  & + & {
    margin-top: 24px;
  }
`;

const SummaryDivider = styled.hr`
  height: 1px;
  margin: 12px 0;
  border: 0;
  background: ${theme.colors.gray100};
`;

const SummaryLabel = styled.span`
  color: ${theme.colors.textPrimary};
  font-size: ${typography.body.fontSize};
  font-weight: ${fontWeights.bold};
  line-height: ${typography.body.lineHeight};
  vertical-align: middle;
`;

const SummaryAmount = styled.span`
  color: ${theme.colors.black};
  font-size: ${typography.display.fontSize};
  font-weight: ${fontWeights.bold};
  line-height: ${typography.display.lineHeight};
  text-align: right;
  vertical-align: middle;
  white-space: nowrap;
`;

const TotalSummaryRow = styled(SummaryRow)`
  margin-top: 0;
`;
