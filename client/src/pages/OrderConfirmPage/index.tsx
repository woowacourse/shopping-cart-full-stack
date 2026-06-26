import PositionBottom from "@/components/common/shared/layout/PositionBottom";
import PageLayout from "@components/common/shared/layout/PageLayout";
import Spacing from "@components/common/shared/layout/Spacing";
import Divider from "@components/common/shared/ui/Divider";
import Header from "@components/common/shared/ui/Header";
import PaymentButton from "@components/feature/pages/orders/PaymentButton";
import OrderConfirmAmountSection from "@components/feature/pages/orders/OrderConfirmAmountSection";
import OrderConfirmApplyCouponButton from "@components/feature/pages/orders/OrderConfirmApplyCouponButton";
import OrderConfirmHeading from "@components/feature/pages/orders/OrderConfirmHeading";
import OrderConfirmProductList from "@components/feature/pages/orders/OrderConfirmProductList";
import OrderDeliveryInfoSection from "@components/feature/pages/orders/OrderDeliveryInfoSectoin";
import GoBackButton from "@components/feature/widgets/GoBackButton";
import styled from "@emotion/styled";
import { Suspense } from "react";

export default function OrderConfirmPage() {
  return (
    <PageLayout>
      <Header LeftComponent={<GoBackButton />} />
      <Spacing size={2.25} />
      <ContentArea>
        <Suspense>
          <OrderConfirmHeading />
          <Spacing size={2.25} />
          <Divider />
          <Spacing size={2.25} />
          <OrderConfirmProductList />
          <Spacing size={2.25} />
          <OrderConfirmApplyCouponButton />
          <Spacing size={2.25} />
          <OrderDeliveryInfoSection />
          <Spacing size={2.25} />
          <OrderConfirmAmountSection />
        </Suspense>
        <Spacing size={8} />
      </ContentArea>
      <PositionBottom>
        <PaymentButton />
      </PositionBottom>
    </PageLayout>
  );
}

const ContentArea = styled.div`
  width: 100%;
  padding-inline: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
`;
