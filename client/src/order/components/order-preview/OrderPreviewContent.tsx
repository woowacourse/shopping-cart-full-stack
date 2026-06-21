import styled from '@emotion/styled';

import {noticeIconUrl} from '../../../design-system/assets/icons/index.js';
import {Checkbox, fontWeights, theme, typography} from '../../../design-system/index.js';
import {ProductItemLayout} from '../../../layout/ProductItemLayout.js';
import {SummaryLayout, SummaryRow} from '../../../layout/SummaryLayout.js';
import {FREE_SHIPPING_THRESHOLD, SHIPPING_FEE} from '../../../shared/domain/shippingPolicy.js';
import type {Preorder, PreorderItem} from '../../api/orderApi.js';

const COUPON_DISCOUNT_AMOUNT = 0;

interface OrderPreviewContentProps {
  isRemoteArea: boolean;
  preorder: Preorder;
  onChangeRemoteArea: (isRemoteArea: boolean) => void;
  onOpenCouponModal: () => void;
}

export const OrderPreviewContent = ({
  isRemoteArea,
  preorder,
  onChangeRemoteArea,
  onOpenCouponModal,
}: OrderPreviewContentProps) => {
  const orderAmount = getOrderAmount(preorder.items);
  const shippingFee = getShippingFee(orderAmount, isRemoteArea);
  const totalPaymentAmount = orderAmount - COUPON_DISCOUNT_AMOUNT + shippingFee;

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
          <SummaryRow left='주문 금액' right={`${orderAmount.toLocaleString('ko-KR')}원`} />
          <SummaryRow left='쿠폰 할인 금액' right={getDiscountAmountText(COUPON_DISCOUNT_AMOUNT)} />
          <SummaryRow left='배송비' right={`${shippingFee.toLocaleString('ko-KR')}원`} />
        </SummaryLayout>
        <SummaryLayout>
          <SummaryRow left='총 결제 금액' right={`${totalPaymentAmount.toLocaleString('ko-KR')}원`} />
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

function getOrderAmount(items: PreorderItem[]) {
  return items.reduce((orderAmount, item) => orderAmount + item.price * item.quantity, 0);
}

function getShippingFee(orderAmount: number, isRemoteArea: boolean) {
  if (orderAmount === 0) return 0;

  const defaultShippingFee = orderAmount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const remoteAreaFee = isRemoteArea ? SHIPPING_FEE : 0;

  return defaultShippingFee + remoteAreaFee;
}

function getDiscountAmountText(discountAmount: number) {
  if (discountAmount === 0) return '0원';

  return `-${discountAmount.toLocaleString('ko-KR')}원`;
}
