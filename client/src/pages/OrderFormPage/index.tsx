import Header from "@components/common/shared/Header";
import PageLayout from "@components/common/shared/PageLayout";
import PositionBottom from "@components/common/shared/PositionBottom";
import Spacing from "@components/common/shared/Spacing";
import DeliverySection from "@components/feature/DeliverySection";
import GoBackButton from "@components/feature/GoBackButton";
import OrderFormHeading from "@components/feature/OrderFormHeading";
import OrderSummarySection from "@components/feature/OrderSummarySection";
import PaymentButton from "@components/feature/PaymentButton";
import ProductListSection from "@components/feature/ProductListSection";
import styled from "@emotion/styled";
import CouponApplyButton from "@components/feature/CouponApplyButton";
import useOrderFormNavigate from "@hooks/useOrderFormNavigate.ts";
import { Suspense } from "react";
import ErrorBoundary from "@components/common/shared/ErrorBoundary";
import ErrorFallback from "@components/common/shared/ErrorFallback";
import OrderFormSkeleton from "./skeleton";

export default function OrderFormPage() {
  const { getState } = useOrderFormNavigate();

  const state = getState();
  if (!state || Number.isNaN(state.orderId)) {
    throw new Error("주문 정보를 찾을 수 없습니다.");
  }

  const orderId = state.orderId;

  return (
    <PageLayout>
      <Header LeftComponent={<GoBackButton />} />

      <ErrorBoundary fallback={<ErrorFallback />}>
        <Suspense fallback={<OrderFormSkeleton />}>
          <OrderFormPageWrapper>
            <Spacing size={2.25} />
            <OrderFormHeading orderId={orderId} />
            <Spacing size={2.25} />

            <ProductListSection orderId={orderId} />
            <Spacing size={2} />
            <CouponApplyButton orderId={orderId} />
            <Spacing size={2} />
            <DeliverySection orderId={orderId} />
            <Spacing size={2} />
            <OrderSummarySection orderId={orderId} />
          </OrderFormPageWrapper>

          <PositionBottom>
            <PaymentButton orderId={orderId} />
          </PositionBottom>
          <Spacing size={7} />
        </Suspense>
      </ErrorBoundary>
    </PageLayout>
  );
}

const OrderFormPageWrapper = styled.div`
  padding-inline: 24px;
`;
