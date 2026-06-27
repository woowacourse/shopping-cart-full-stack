import { useEffect, useMemo, useRef, useState } from "react";
import { useCartQuery } from "../../cart/hooks/useCartQuery";
import { useCouponsQuery } from "../hooks/useCouponsQuery";
import { useModal } from "../../../shared/components/Modal";
import { useOrderPreview } from "../hooks/useOrderPreview";
import { Row, Stack } from "../../../shared/components/layout";
import styled from "@emotion/styled";
import { colors } from "../../../shared/styles/tokens";
import { CheckoutItemRow } from "../components/CheckoutItemRow";
import { Button } from "../../../shared/components/Button";
import { Checkbox } from "../../../shared/components/CheckBox";
import { CouponModal } from "../components/CouponModal";
import { InfoOutlineIcon } from "../../../assets/icons/InfoOutlineIcon";
import { FREE_SHIPPING_THRESHOLD } from "../../cart/selectors";
import { useNavigate } from "react-router-dom";
import type { PaymentConfirmState } from "../types";

export function CheckoutSection({
  selectedItemIds,
}: {
  selectedItemIds: string[];
}) {
  const allItems = useCartQuery();
  const coupons = useCouponsQuery();
  const selectedItems = useMemo(
    () => allItems.filter((item) => selectedItemIds.includes(item.id)),
    [allItems, selectedItemIds],
  );

  const [isRemoteArea, setIsRemoteArea] = useState(false);
  const [appliedCouponIds, setAppliedCouponIds] = useState<string[]>([]);
  const { isOpen, open, close } = useModal();

  const { preview, isLoading, refresh } = useOrderPreview(selectedItemIds);

  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true; // 최초 1회만 auto 미리보기 (가드 완성)
    void refresh(
      coupons.map((coupon) => coupon.id),
      false,
      "auto",
    ).then((result) => {
      if (result) setAppliedCouponIds(result.appliedCoupons);
    });
  }, [coupons, refresh]);

  const handleApplyCoupons = (ids: string[]) => {
    setAppliedCouponIds(ids);
    void refresh(ids, isRemoteArea, "manual");
  };

  const handleToggleRemote = () => {
    const next = !isRemoteArea;
    setIsRemoteArea(next);
    void refresh(appliedCouponIds, next, "manual");
  };

  const totalQuantity = selectedItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const navigate = useNavigate();
  const handlePay = () => {
    if (!preview) return;
    const state: PaymentConfirmState = {
      kindsCount: selectedItems.length,
      totalQuantity,
      totalPrice: preview.totalPrice,
    };
    navigate("/payment-confirm", { state });
  };

  return (
    <Stack gap={24}>
      <Title>주문 확인</Title>
      <Description>
        총 {selectedItems.length}종류의 상품 {totalQuantity}개를 주문합니다.
        <br />
        최종 결제 금액을 확인해 주세요.
      </Description>

      <Stack as="ul" style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {selectedItems.map((item) => (
          <CheckoutItemRow key={item.id} item={item} />
        ))}
      </Stack>

      <Button variant="ghost" fullWidth onClick={open}>
        쿠폰 적용
        {appliedCouponIds.length > 0 && `(${appliedCouponIds.length})`}
      </Button>

      <Checkbox
        checked={isRemoteArea}
        onChange={handleToggleRemote}
        label="제주 및 도서산간 지역"
      />

      {preview && (
        <>
          <Hint>
            <InfoOutlineIcon width={12} height={12} />총 주문 금액이{" "}
            {FREE_SHIPPING_THRESHOLD.toLocaleString()}원 이상일 경우 무료
            배송됩니다.
          </Hint>
          <SummarySection>
            <Row justify="space-between" align="center">
              <SummaryLabel>주문 금액</SummaryLabel>
              <SummaryAmount>
                {preview.orderAmount.toLocaleString()}원
              </SummaryAmount>
            </Row>
            <Row justify="space-between" align="center">
              <SummaryLabel>쿠폰 할인 금액</SummaryLabel>
              <SummaryAmount>
                -{preview.couponDiscount.toLocaleString()}원
              </SummaryAmount>
            </Row>
            <Row justify="space-between" align="center">
              <SummaryLabel>배송비</SummaryLabel>
              <SummaryAmount>
                {preview.deliveryFee.toLocaleString()}원
              </SummaryAmount>
            </Row>
            <TotalRow justify="space-between" align="center">
              <SummaryLabel>총 결제 금액</SummaryLabel>
              <SummaryAmount>
                {preview.totalPrice.toLocaleString()}원
              </SummaryAmount>
            </TotalRow>
          </SummarySection>
        </>
      )}

      <Button
        variant="primary"
        fullWidth
        disabled={!preview || isLoading}
        onClick={handlePay}
      >
        결제하기
      </Button>

      <CouponModal
        isOpen={isOpen}
        onClose={close}
        coupons={coupons}
        appliedCouponIds={appliedCouponIds}
        onApply={handleApplyCoupons}
        selectedItemIds={selectedItemIds}
        isRemoteArea={isRemoteArea}
      />
    </Stack>
  );
}

const Title = styled.h1`
  font-family: "Noto Sans KR", sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0;
`;
const Description = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: ${colors.textPrimary};
  margin: 0;
  line-height: 1.5;
`;
const SummarySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid ${colors.divider};
`;
const TotalRow = styled(Row)`
  padding-top: 12px;
  border-top: 1px solid ${colors.divider};
`;
const SummaryLabel = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: ${colors.textPrimary};
`;
const SummaryAmount = styled.span`
  font-family: "Noto Sans KR", sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: ${colors.textPrimary};
`;
const Hint = styled.p`
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 0;
  font-size: 12px;
  color: ${colors.textPrimary};
`;
