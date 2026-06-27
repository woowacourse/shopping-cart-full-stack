import styled from 'styled-components';
import type { PriceContextType } from './OrderSuccessView';
import { PriceSummaryLine } from '../../../shared/components/PriceSummaryLine';
import { Notice } from '../../../shared/styles/common';

export const OrderSummary = ({
  priceContext,
}: {
  priceContext: PriceContextType;
}) => {
  return (
    <>
      <SummarySection>
        <Notice>총 주문 금액이 100,000원 이상일 경우 무료 배송됩니다.</Notice>
        <SummaryBox>
          <PriceSummaryLine title="주문 금액" value={priceContext.orderPrice} />
          <PriceSummaryLine
            title="쿠폰 할인 금액"
            value={
              priceContext.productDiscountPrice !== 0
                ? -priceContext.productDiscountPrice
                : 0
            }
          />
          <PriceSummaryLine title="배송비" value={priceContext.deliveryFee} />
          <Divider />
          <PriceSummaryLine
            title="총 결제 금액"
            value={priceContext.totalPrice}
          />
        </SummaryBox>
      </SummarySection>
    </>
  );
};

const SummarySection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 8px;
`;

const SummaryBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Divider = styled.hr`
  width: 100%;
  height: 1px;
  margin: 0;
  border: 0;

  background-color: #eeeeee;
`;
