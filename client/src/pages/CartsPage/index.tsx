import ErrorBoundary from "@components/common/entities/ErrorBoundary";
import PageLayout from "@components/common/shared/layout/PageLayout";
import PositionBottom from "@components/common/shared/layout/PositionBottom";
import Spacing from "@components/common/shared/layout/Spacing";
import ErrorFallback from "@components/common/shared/ui/ErrorFallback";
import Header from "@components/common/shared/ui/Header";
import Logo from "@components/common/shared/ui/Logo";
import CartConfirmButton from "@components/feature/pages/carts/CartConfirmButton";
import CartHeadingSection from "@components/feature/pages/carts/CartHeadingSection";
import CartListSection from "@components/feature/pages/carts/CartListSection";
import styled from "@emotion/styled";
import { Suspense } from "react";

export default function CartsPage() {
  return (
    <PageLayout>
      <Header LeftComponent={<Logo />} />
      <ContentArea>
        <ErrorBoundary fallback={<ErrorFallback />}>
          <ContentContainer>
            <Spacing size={2.25} />
            <Suspense fallback={<CartHeadingSection.Skeleton />}>
              <CartHeadingSection />
            </Suspense>
            <Spacing size={2.25} />
            <Suspense fallback={<CartListSection.Skeleton />}>
              <CartListSection />
            </Suspense>
          </ContentContainer>
          <Spacing size={7} />

          <PositionBottom>
            <Suspense fallback={<CartConfirmButton.Skeleton />}>
              <CartConfirmButton />
            </Suspense>
          </PositionBottom>
        </ErrorBoundary>
      </ContentArea>
    </PageLayout>
  );
}

const ContentArea = styled.div`
  width: 100%;
  padding-inline: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: auto;
`;

const ContentContainer = styled.section`
  display: flex;
  flex-direction: column;
  flex: 1;
`;
