import styled from '@emotion/styled';

import {noticeIconUrl} from '../../design-system/assets/icons/index.js';
import {Checkbox, fontWeights, theme, typography} from '../../design-system/index.js';
import {ProductItemLayout} from '../../layout/ProductItemLayout.js';
import {SummaryLayout, SummaryRow} from '../../layout/SummaryLayout.js';
import {FREE_SHIPPING_THRESHOLD} from '../../shared/domain/shippingPolicy.js';
import type {Preorder, PreorderItem} from '../../preorder/domain/types.js';
import type {OrderPrice} from '../api/orderPreviewApi.js';

interface OrderPreviewContentProps {
  isRemoteArea: boolean;
  price: OrderPrice;
  preorder: Preorder;
  onChangeRemoteArea: (isRemoteArea: boolean) => void;
  onOpenCouponModal: () => void;
}

export const OrderPreviewContent = ({
  isRemoteArea,
  price,
  preorder,
  onChangeRemoteArea,
  onOpenCouponModal,
}: OrderPreviewContentProps) => {
  return (
    <>
      <PreviewProductList>
        {preorder.items.map((item) => (
          <PreviewProductItem key={item.productId} item={item} />
        ))}
      </PreviewProductList>

      <CouponButton type='button' onClick={onOpenCouponModal}>
        쿠폰 적용
      </CouponButton>

      <ShippingSection>
        <SectionTitle>배송 정보</SectionTitle>
        <Checkbox
          checked={isRemoteArea}
          label='제주도 및 도서 산간 지역'
          onChange={(event) => onChangeRemoteArea(event.currentTarget.checked)}
        />
      </ShippingSection>

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
    </>
  );
};

interface PreviewProductItemProps {
  item: PreorderItem;
}

const PreviewProductItem = ({item}: PreviewProductItemProps) => {
  return (
    <PreviewProductItemRoot image={<img alt={item.name} src={item.imageUrl} />}>
      <ProductInfo>
        <ProductName>{item.name}</ProductName>
        <ProductPrice>{item.price.toLocaleString('ko-KR')}원</ProductPrice>
        <ProductQuantity>{item.quantity}개</ProductQuantity>
      </ProductInfo>
    </PreviewProductItemRoot>
  );
};

const PreviewProductItemRoot = styled(ProductItemLayout)`
  padding-bottom: 20px;
`;

const PreviewProductList = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 36px;
`;

const ProductInfo = styled.div`
  display: flex;
  min-width: 0;
  height: 112px;
  flex-direction: column;
  justify-content: center;
`;

const ProductName = styled.strong`
  color: ${theme.colors.textPrimary};
  font-size: ${typography.caption.fontSize};
  font-weight: ${fontWeights.bold};
  line-height: ${typography.caption.lineHeight};
`;

const ProductPrice = styled.strong`
  margin-top: 8px;
  color: ${theme.colors.black};
  font-size: ${typography.display.fontSize};
  font-weight: ${fontWeights.bold};
  line-height: ${typography.display.lineHeight};
`;

const ProductQuantity = styled.span`
  margin-top: 28px;
  color: ${theme.colors.textPrimary};
  font-size: ${typography.caption.fontSize};
  font-weight: ${fontWeights.medium};
  line-height: ${typography.caption.lineHeight};
`;

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

const ShippingSection = styled.section`
  margin-top: 32px;
`;

const SectionTitle = styled.h2`
  margin: 0 0 16px;
  color: ${theme.colors.textPrimary};
  font-size: ${typography.body.fontSize};
  font-weight: ${fontWeights.bold};
  line-height: ${typography.body.lineHeight};
`;

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
