import styled from "@emotion/styled";
import { Suspense, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { colors } from "../../../shared/styles/tokens";
import type { CheckoutState } from "../types";
import { ErrorBoundary } from "../../../shared/components/ErrorBoundary";
import { ErrorFallback } from "../../../shared/components/ErrorFallback";
import { queryStore } from "../../../shared/queries";
import { COUPONS_QUERY_KEY } from "../hooks/useCouponsQuery";
import { CartSkeleton } from "../../../shared/components/CartSkeleton";
import { CheckoutSection } from "./CheckoutSection";

export function CheckoutPage() {
  const { state } = useLocation() as { state: CheckoutState | null };
  const navigate = useNavigate();

  useEffect(() => {
    if (!state) navigate("/", { replace: true });
  }, [state, navigate]);

  if (!state) return null;

  return (
    <Page>
      <ErrorBoundary
        fallback={ErrorFallback}
        onReset={() => queryStore.invalidate(COUPONS_QUERY_KEY)}
      >
        <Suspense fallback={<CartSkeleton />}>
          <CheckoutSection selectedItemIds={state.selectedItemIds} />
        </Suspense>
      </ErrorBoundary>
    </Page>
  );
}

const Page = styled.section`
  max-width: 480px;
  margin: 0 auto;
  padding: 24px 16px;
  min-height: calc(100vh - 64px);
  background: ${colors.background};
  box-sizing: border-box;
`;
