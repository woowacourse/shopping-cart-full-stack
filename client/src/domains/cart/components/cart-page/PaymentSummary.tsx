import styled from '@emotion/styled';

import {noticeIconUrl} from '../../../../design-system/assets/icons/index.js';
import {Typo} from '../../../../design-system/index.js';
import {SummaryLayout, SummaryRow} from '../../../../shared/layout/SummaryLayout.js';
import {FREE_SHIPPING_THRESHOLD} from '../../../../shared/domain/shippingPolicy.js';

type PaymentSummaryProps = {
  selectedOrderAmount: number;
  shippingFee: number;
  totalPrice: number;
};

export const PaymentSummary = ({selectedOrderAmount, shippingFee, totalPrice}: PaymentSummaryProps) => {
  return (
    <SummaryArea>
      <FreeShippingNotice>
        <NoticeIcon alt='' src={noticeIconUrl} />
        <NoticeText as='p' variant='caption' weight='medium'>
          총 주문 금액이 {FREE_SHIPPING_THRESHOLD.toLocaleString('ko-KR')}원 이상일 경우 무료 배송됩니다.
        </NoticeText>
      </FreeShippingNotice>
      <SummaryLayout>
        <SummaryRow left='주문 금액' right={`${selectedOrderAmount.toLocaleString('ko-KR')}원`} />
        <SummaryRow left='배송비' right={`${shippingFee.toLocaleString('ko-KR')}원`} />
      </SummaryLayout>
      <SummaryLayout>
        <SummaryRow left='총 결제 금액' right={`${totalPrice.toLocaleString('ko-KR')}원`} />
      </SummaryLayout>
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
