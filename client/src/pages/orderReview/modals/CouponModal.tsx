import { type ChangeEvent } from "react";

import { Modal } from "@/core/components/Modal";
import { Button } from "@/core/components/Button";
import { List } from "@/core/components/List";
import { Checkbox } from "@/core/components/Checkbox";

import { formatNumber, formatDate } from "@/core/utils/format";

import { useOrderSheetCoupons } from "./useOrderSheetCoupons";

interface Props {
  couponSelection: number[];
  onUpdateCouponSelection: ({
    couponSelection,
  }: {
    couponSelection: number[];
  }) => void;
  onClose: () => void;
}

export const CouponModal = ({
  couponSelection,
  onUpdateCouponSelection,
  onClose,
}: Props) => {
  const {
    coupons,
    discountAmount,
    changeCouponSelection,
    updateCouponSelection,
  } = useOrderSheetCoupons({
    couponSelection,
    updateCouponSelection: onUpdateCouponSelection,
  });

  const handleChangeCouponSelection = (e: ChangeEvent<HTMLInputElement>) => {
    changeCouponSelection({
      id: Number(e.target.id),
      checked: e.target.checked,
    });
  };

  const handleSubmit = async () => {
    await updateCouponSelection();
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <Modal.Header>쿠폰을 선택해 주세요</Modal.Header>
      <p>쿠폰은 최대 2개까지 사용할 수 있습니다.</p>

      <List>
        {coupons?.map((coupon) => {
          return (
            <List.Item>
              <List.Item.Box
                style={{
                  ...(!coupon.isAble && {
                    opacity: 0.5,
                    pointerEvents: "none",
                  }),
                }}
                title={
                  <Checkbox
                    id={coupon.id}
                    label={coupon.name}
                    checked={coupon.isSelected}
                    onChange={handleChangeCouponSelection}
                  />
                }
                description={
                  <>
                    {coupon.expirationDate && (
                      <>만료일: {formatDate(coupon.expirationDate)}</>
                    )}
                    {coupon.minOrderAmount && (
                      <>
                        <br /> 최소 주문 금액:{" "}
                        {formatNumber(coupon.minOrderAmount)}원
                      </>
                    )}
                    {coupon.validTime && (
                      <>
                        <br /> 사용 가능 시간: {coupon.validTime.start}부터
                        {coupon.validTime.end}까지
                      </>
                    )}
                  </>
                }
              ></List.Item.Box>
            </List.Item>
          );
        })}
      </List>

      <Button variant="primary" size="medium" block onClick={handleSubmit}>
        총 {discountAmount}원 할인 쿠폰 사용하기
      </Button>
    </Modal>
  );
};
