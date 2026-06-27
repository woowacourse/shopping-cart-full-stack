import styled from "@emotion/styled";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../../shared/components/Button";
import { Stack } from "../../../shared/components/layout";
import { colors } from "../../../shared/styles/tokens";
import type { PaymentConfirmState } from "../types";

export function PaymentConfirmPage() {
  const { state } = useLocation() as { state: PaymentConfirmState | null };
  const navigate = useNavigate();

  // 직접 URL 진입/새로고침으로 state 가 없으면 장바구니로
  useEffect(() => {
    if (!state) navigate("/", { replace: true });
  }, [state, navigate]);

  if (!state) return null;

  return (
    <Page>
      <Center>
        <Stack gap={12} align="center">
          <Title>결제 확인</Title>
          <Description>
            총 {state.kindsCount}종류의 상품 {state.totalQuantity}개를
            주문했습니다.
            <br />
            최종 결제 금액을 확인해 주세요.
          </Description>
        </Stack>
        <Stack gap={8} align="center">
          <TotalLabel>총 결제 금액</TotalLabel>
          <TotalAmount>{state.totalPrice.toLocaleString()}원</TotalAmount>
        </Stack>
      </Center>
      <Button variant="primary" fullWidth onClick={() => navigate("/")}>
        장바구니로 돌아가기
      </Button>
    </Page>
  );
}

const Page = styled.section`
  max-width: 480px;
  margin: 0 auto;
  padding: 24px 16px;
  min-height: calc(100vh - 64px);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: ${colors.background};
`;
const Center = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
`;
const Title = styled.h1`
  font-family: "Noto Sans KR", sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0;
`;
const Description = styled.p`
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  color: ${colors.textPrimary};
  margin: 0;
  line-height: 1.5;
`;
const TotalLabel = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: ${colors.textPrimary};
`;
const TotalAmount = styled.span`
  font-family: "Noto Sans KR", sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: ${colors.textPrimary};
`;
