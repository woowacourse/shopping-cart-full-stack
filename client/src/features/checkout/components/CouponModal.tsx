import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import type { Coupon } from "../types";
import { Modal } from "../../../shared/components/Modal";
import { Row, Stack } from "../../../shared/components/layout";
import { CouponItem } from "./CouponItem";
import { Button } from "../../../shared/components/Button";
import { InfoOutlineIcon } from "../../../assets/icons/InfoOutlineIcon";
import { colors } from "../../../shared/styles/tokens";
import { useOrderPreview } from "../hooks/useOrderPreview";

const MAX_COUPONS = 2;

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  coupons: Coupon[];
  appliedCouponIds: string[];
  onApply: (couponIds: string[]) => void;
  selectedItemIds: string[];
  isRemoteArea: boolean;
}

export function CouponModal({
  isOpen,
  onClose,
  coupons,
  appliedCouponIds,
  onApply,
  selectedItemIds,
  isRemoteArea,
}: CouponModalProps) {
  const [draft, setDraft] = useState<Set<string>>(
    () => new Set(appliedCouponIds),
  );
  const { preview, isLoading, error, refresh } =
    useOrderPreview(selectedItemIds);

  useEffect(() => {
    if (isOpen) setDraft(new Set(appliedCouponIds));
  }, [isOpen, appliedCouponIds]);

  useEffect(() => {
    if (!isOpen) return;

    void refresh([...draft], isRemoteArea, "manual");
  }, [isOpen, draft, isRemoteArea, refresh]);

  const toggle = (id: string) => {
    setDraft((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < MAX_COUPONS) {
        next.add(id);
      }
      return next;
    });
  };

  const handleApply = () => {
    onApply([...draft]);
    onClose();
  };

  const discount = preview?.couponDiscount ?? 0;
  const ready = !isLoading && !error && preview !== null;
  const couponStatuses = preview?.couponStatuses ?? [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel="쿠폰을 선택해 주세요">
      <Modal.Header>쿠폰을 선택해 주세요</Modal.Header>
      <Modal.Body>
        <Stack gap={16}>
          <Row align="center" gap={4}>
            <InfoOutlineIcon color={colors.textPrimary} />
            <NoticeText>쿠폰은 최대 2개까지 사용할 수 있습니다.</NoticeText>
          </Row>
          <Stack as="ul" style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {coupons.map((coupon) => {
              const checked = draft.has(coupon.id);
              const status = couponStatuses.find((s) => s.id === coupon.id);
              const disabled =
                (status !== undefined && !status.applicable) ||
                (!checked && draft.size >= MAX_COUPONS);
              return (
                <li key={coupon.id}>
                  <CouponItem
                    coupon={coupon}
                    checked={checked}
                    disabled={disabled}
                    reason={status?.reason ?? null}
                    onToggle={() => toggle(coupon.id)}
                  />
                </li>
              );
            })}
          </Stack>
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          fullWidth
          disabled={!ready}
          onClick={handleApply}
        >
          {isLoading
            ? "계산중"
            : error
              ? "쿠폰 정보를 불러오지 못했어요"
              : `총 ${discount.toLocaleString()}원 할인 쿠폰 사용하기`}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

const NoticeText = styled.span`
  font-size: 12px;
  color: ${colors.textPrimary};
`;
