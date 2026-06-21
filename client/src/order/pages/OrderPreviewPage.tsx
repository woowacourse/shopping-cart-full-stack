import {useNavigate} from 'react-router-dom';
import styled from '@emotion/styled';

import {backArrowIconUrl, noticeIconUrl} from '../../design-system/assets/icons/index.js';
import {Button, Checkbox, fontWeights, theme, typography} from '../../design-system/index.js';
import {PageIntro} from '../../layout/PageIntro.js';
import {ScreenLayout} from '../../layout/ScreenLayout.js';

const orderPreview = {
  itemCount: 1,
  quantity: 2,
  product: {
    name: '상품이름A',
    price: 35000,
    imageUrl: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=300&q=80',
  },
  price: {
    orderAmount: 70000,
    couponDiscountAmount: 6000,
    shippingFee: 6000,
    totalPaymentAmount: 70000,
  },
};

export const OrderPreviewPage = () => {
  const navigate = useNavigate();

  return (
    <ScreenLayout
      header={
        <BackButton onClick={() => navigate('/cart')} type='button'>
          <BackIcon alt='뒤로가기' src={backArrowIconUrl} />
        </BackButton>
      }
      bottomButton={<Button onClick={() => navigate('/order-confirm')}>결제하기</Button>}
    >
      <PageIntro
        title='주문 확인'
        description={
          <>
            총 {orderPreview.itemCount}종류의 상품 {orderPreview.quantity}개를 주문합니다.
            <br />
            최종 결제 금액을 확인해 주세요.
          </>
        }
      />

      <ProductSection>
        <ProductImage alt={orderPreview.product.name} src={orderPreview.product.imageUrl} />
        <ProductInfo>
          <ProductName>{orderPreview.product.name}</ProductName>
          <ProductPrice>{orderPreview.product.price.toLocaleString('ko-KR')}원</ProductPrice>
          <ProductQuantity>{orderPreview.quantity}개</ProductQuantity>
        </ProductInfo>
      </ProductSection>

      <CouponButton type='button'>쿠폰 적용</CouponButton>

      <ShippingSection>
        <SectionTitle>배송 정보</SectionTitle>
        <Checkbox checked label='제주도 및 도서 산간 지역' readOnly />
      </ShippingSection>

      <PriceSummary aria-label='결제 요약'>
        <FreeShippingNotice>
          <NoticeIcon alt='' aria-hidden='true' src={noticeIconUrl} />
          <NoticeText>총 주문 금액이 100,000원 이상일 경우 무료 배송됩니다.</NoticeText>
        </FreeShippingNotice>
        <SummaryDivider />
        <SummaryRow>
          <SummaryLabel>주문 금액</SummaryLabel>
          <SummaryAmount>{orderPreview.price.orderAmount.toLocaleString('ko-KR')}원</SummaryAmount>
        </SummaryRow>
        <SummaryRow>
          <SummaryLabel>쿠폰 할인 금액</SummaryLabel>
          <SummaryAmount>-{orderPreview.price.couponDiscountAmount.toLocaleString('ko-KR')}원</SummaryAmount>
        </SummaryRow>
        <SummaryRow>
          <SummaryLabel>배송비</SummaryLabel>
          <SummaryAmount>{orderPreview.price.shippingFee.toLocaleString('ko-KR')}원</SummaryAmount>
        </SummaryRow>
        <SummaryDivider />
        <TotalSummaryRow>
          <SummaryLabel>총 결제 금액</SummaryLabel>
          <SummaryAmount>{orderPreview.price.totalPaymentAmount.toLocaleString('ko-KR')}원</SummaryAmount>
        </TotalSummaryRow>
      </PriceSummary>
    </ScreenLayout>
  );
};

export default OrderPreviewPage;

const BackButton = styled.button`
  display: inline-flex;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
`;

const BackIcon = styled.img`
  width: 21px;
  height: 21px;
  object-fit: contain;
`;

const ProductSection = styled.section`
  display: grid;
  grid-template-columns: 112px minmax(0, 1fr);
  gap: 24px;
  align-items: center;
  margin-top: 36px;
  padding-top: 12px;
  border-top: 1px solid ${theme.colors.gray100};
`;

const ProductImage = styled.img`
  display: block;
  width: 112px;
  height: 112px;
  border-radius: ${theme.radius[8]};
  background: ${theme.colors.gray100};
  object-fit: cover;
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
  margin-top: 32px;
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

const SummaryDivider = styled.hr`
  height: 1px;
  margin: 12px 0 24px;
  border: 0;
  background: ${theme.colors.gray100};
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

const TotalSummaryRow = styled(SummaryRow)`
  margin-top: 24px;
`;

const SummaryLabel = styled.span`
  color: ${theme.colors.textPrimary};
  font-size: ${typography.body.fontSize};
  font-weight: ${fontWeights.bold};
  line-height: ${typography.body.lineHeight};
`;

const SummaryAmount = styled.span`
  color: ${theme.colors.black};
  font-size: ${typography.display.fontSize};
  font-weight: ${fontWeights.bold};
  line-height: ${typography.display.lineHeight};
  text-align: right;
  white-space: nowrap;
`;
