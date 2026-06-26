import styled from '@emotion/styled';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import BackIcon from '../Icons/BackIcon';
import Button from '../components/Button';
import {
  ContentDescription,
  Notice,
  PageTitle,
} from '../components/Typography';
import { useOrderSheet } from '../hooks/useOrderSheet';
import { useOrderSheetPricing } from '../hooks/useOrderSheetPricing';
import OrderItem from './components/OrderItem';
import OrderContent from './components/OrderContent';
import NoticeIcon from '../Icons/NoticeIcon';
import CheckBox from '../components/CheckBox';
import CouponModal from './components/CouponModal';
import OrderSummaryContent from './components/OrderSummaryContent';
import OrderSummaryRow from './components/OrderSummaryRow';

const OrderConfirmPage = () => {
  const { orderSheetId } = useParams();
  const navigate = useNavigate();
  const {
    orderSheet,
    isLoading: isOrderSheetLoading,
    error: orderSheetError,
    updateShippingArea,
    updateCoupons,
  } = useOrderSheet(orderSheetId);
  const {
    pricing,
    isLoading: isPricingLoading,
    error: pricingError,
    refetchPricing,
  } = useOrderSheetPricing(orderSheetId);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

  const productTypeCount = orderSheet?.items.length ?? 0;
  const productQuantity =
    orderSheet?.items.reduce((total, item) => total + item.quantity, 0) ?? 0;
  const isInitialLoading =
    (isOrderSheetLoading || isPricingLoading) && (!orderSheet || !pricing);
  const initialError = orderSheetError ?? (!pricing ? pricingError : null);

  const handleShippingAreaToggle = async () => {
    if (!orderSheet) return;

    try {
      await updateShippingArea(!orderSheet.isRemoteShippingArea);
      refetchPricing();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : '배송 정보를 변경하지 못했습니다.',
      );
    }
  };

  const handleCouponApply = async (selectedCouponIds: string[]) => {
    try {
      await updateCoupons(selectedCouponIds);
      refetchPricing();
      setIsCouponModalOpen(false);
    } catch (error) {
      alert(
        error instanceof Error ? error.message : '쿠폰을 적용하지 못했습니다.',
      );
    }
  };

  const handlePayment = () => {
    if (!orderSheet || !pricing) return;

    navigate(`/payment/${orderSheet.id}`);
  };

  return (
    <PageLayout
      headerContent={
        <BackButton
          type="button"
          onClick={() => navigate(-1)}
          aria-label="뒤로 가기"
        >
          <BackIcon />
        </BackButton>
      }
    >
      <PageTitle>주문 확인</PageTitle>

      <OrderContent isLoading={isInitialLoading} error={initialError}>
        {orderSheet && (
          <>
            <OrderItemsSection>
              <ContentDescription>
                총 {productTypeCount}종류의 상품 {productQuantity}개를
                주문합니다.
                <br />
                최종 결제 금액을 확인해 주세요.
              </ContentDescription>

              {orderSheet.items.map(({ product, quantity }) => (
                <OrderItem
                  key={product.id}
                  name={product.name}
                  thumbnail={product.thumbnail}
                  price={product.price}
                  quantity={quantity}
                />
              ))}
            </OrderItemsSection>

            <CouponSection>
              <CouponApplyButton
                type="button"
                onClick={() => setIsCouponModalOpen(true)}
              >
                쿠폰 적용
              </CouponApplyButton>
            </CouponSection>

            <ShippingSection aria-label="배송 정보">
              <ShippingTitle>배송 정보</ShippingTitle>
              <CheckBox
                checked={orderSheet.isRemoteShippingArea}
                label="제주도 및 도서 산간 지역"
                onToggle={handleShippingAreaToggle}
              />
            </ShippingSection>
          </>
        )}

        <NoticeSection>
          <NoticeIcon />
          <Notice>총 주문 금액이 100,000원 이상일 경우 무료 배송됩니다.</Notice>
        </NoticeSection>

        <OrderSummaryContent isLoading={isPricingLoading} error={pricingError}>
          {pricing && (
            <OrderSummarySection aria-label="결제 금액 요약">
              <OrderSummaryRow label="주문 금액" amount={pricing.orderAmount} />
              <OrderSummaryRow
                label="쿠폰 할인 금액"
                amount={pricing.discountAmount}
                prefix="-"
              />
              <OrderSummaryRow label="배송비" amount={pricing.shippingFee} />

              <SummaryDivider />

              <OrderSummaryRow
                label="총 결제 금액"
                amount={pricing.totalPaymentAmount}
              />
            </OrderSummarySection>
          )}
        </OrderSummaryContent>
      </OrderContent>

      <BottomButtonWrapper>
        <Button
          fullWidth
          disabled={
            !orderSheet || !pricing || isPricingLoading || !!pricingError
          }
          onClick={handlePayment}
        >
          결제하기
        </Button>
      </BottomButtonWrapper>

      {isCouponModalOpen && orderSheet && pricing && (
        <CouponModal
          orderSheetId={orderSheet.id}
          initialDiscountAmount={pricing.discountAmount}
          initialSelectedCouponIds={orderSheet.selectedCouponIds}
          onApply={handleCouponApply}
          onClose={() => setIsCouponModalOpen(false)}
        />
      )}
    </PageLayout>
  );
};

const BackButton = styled.button`
  padding: 0;
  width: 2rem;
  border: none;
  background: none;
  cursor: pointer;
`;

const OrderItemsSection = styled.section``;

const CouponSection = styled.section`
  margin-top: 1.5rem;
`;

const ShippingSection = styled.section`
  margin-top: 1.5rem;
`;

const ShippingTitle = styled.h2`
  margin: 0 0 0.75rem;
  font-size: 1rem;
  font-weight: 700;
`;

const CouponApplyButton = styled.button`
  width: 100%;
  height: 3.25rem;
  border: 1px solid #0000001a;
  border-radius: 0.25rem;
  background-color: #ffffff;
  color: #777777;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
`;

const NoticeSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin: 0.5rem 0;
  padding-top: 1rem;
`;

const OrderSummarySection = styled.section`
  margin-top: 0.75rem;
  border-top: 1px solid #0000001a;
`;

const SummaryDivider = styled.hr`
  height: 1px;
  margin: 0.75rem 0;
  border: 0;
  background-color: #0000001a;
`;

const BottomButtonWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  width: 100%;
  max-width: 26rem;
  transform: translateX(-50%);
  z-index: 100;
`;

export default OrderConfirmPage;
