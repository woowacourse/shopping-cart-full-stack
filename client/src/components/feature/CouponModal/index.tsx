import info from "@assets/info.svg";
import x from "@assets/x.svg";
import CouponItem from "@components/feature/CouponItem";
import Button from "@components/common/shared/Button";
import Flex from "@components/common/shared/Flex";
import Spacing from "@components/common/shared/Spacing";
import Text from "@components/common/shared/Text";
import styled from "@emotion/styled";
import useCheckedItems from "@hooks/useCheckedItems.ts";
import type { ModalComponentProps } from "@contexts/ModalContext.tsx";
import { COLOR_PALETTE } from "@styles/colorPalette.ts";
import { useDeferredValue, useEffect, useRef } from "react";
import Modal from "@components/common/shared/Modal";
import useOrderCouponsQuery from "@/hooks/useOrderCouponsQuery";
import useOrderQuery from "@/hooks/useOrderQuery";
import useOrderDiscountQuery from "@/hooks/useOrderDiscountQuery";

interface CouponModalProps extends ModalComponentProps<number[]> {
  orderId: number;
}

export default function CouponModal({ orderId, onConfirm, onCancel }: CouponModalProps) {
  const { data: order } = useOrderQuery(orderId);
  const { checkedItems, select, unselect } = useCheckedItems<number>(order.coupons);
  const deferredCheckedItems = useDeferredValue(checkedItems);

  const {
    data: { coupons },
  } = useOrderCouponsQuery(orderId);
  const {
    data: { discountAmount },
  } = useOrderDiscountQuery(orderId, { couponId: deferredCheckedItems });

  const canCheckMore = checkedItems.length < 2;
  const isChecked = (id: number) => checkedItems.includes(id);
  const isDisabled = (id: number) => !canCheckMore && !isChecked(id);

  const handleCouponToggle = (id: number) => {
    if (isDisabled(id)) return;
    if (isChecked(id)) return unselect(id);
    select(id);
  };

  const handleClose = () => {
    onCancel();
  };

  const handleConfirm = () => {
    onConfirm(checkedItems);
  };

  const modalRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    modalRef.current?.showModal();
  }, []);

  return (
    <Modal modalRef={modalRef} shouldLockBackgroundScroll closeOnBackdropClick onClose={handleClose} aria-label="쿠폰">
      <ContentContainer direction="column">
        <Flex justify="space-between" align="center">
          <Text typograph="heading2" as="h3">
            쿠폰을 선택해 주세요
          </Text>
          <CloseButton src={x} iconOnly size="md" variant="ghost" onClick={handleClose} aria-label="닫기" />
        </Flex>
        <Spacing size={2} />

        <Flex gap={4} align="center">
          <InfoIcon src={info} alt="정보" />
          <Text typograph="caption" as="span">
            쿠폰은 최대 2개까지 사용할 수 있습니다.
          </Text>
        </Flex>
        <Spacing size={1} />

        <CouponList as="ul" direction="column" gap={12} aria-label="쿠폰 리스트">
          {coupons.map((coupon) => (
            <CouponItem
              key={coupon.id}
              coupon={coupon}
              disabled={isDisabled(coupon.id)}
              checked={isChecked(coupon.id)}
              onSelect={() => handleCouponToggle(coupon.id)}
            />
          ))}
        </CouponList>
        <Spacing size={1.25} />
        <Button fullWidth rounded size="md" intent="secondary" onClick={handleConfirm}>
          총 {discountAmount.toLocaleString()}원 할인 쿠폰 사용하기
        </Button>
      </ContentContainer>
    </Modal>
  );
}

const ContentContainer = styled(Flex)`
  width: 382px;
  height: 614px;
  padding: 24px 32px;
  border-radius: 8px;
  background-color: ${COLOR_PALETTE.white};
`;

const CloseButton = styled(Button)<{ src: string }>`
  background-image: url("${({ src }) => src}");
  background-repeat: no-repeat;
  background-position: center;
`;

const InfoIcon = styled.img`
  width: 0.875rem;
  aspect-ratio: 1/1;
`;

const CouponList = styled(Flex)`
  flex: 1;
  overflow-y: auto;
`;
