import { useCoupons } from "./useCoupons";
import { useOrderSheetAbleCoupons } from "./useOrderSheetAbleCoupons";
import { useOrderSheetCouponSelection } from "./useOrderSheetCouponSelection";

interface Props {
  couponSelection: number[];
  updateCouponSelection: ({
    couponSelection,
  }: {
    couponSelection: number[];
  }) => void;
}

export const useOrderSheetCoupons = ({
  couponSelection,
  updateCouponSelection: updateCouponSelectionActions,
}: Props) => {
  const { coupons } = useCoupons();
  const { ableCoupons } = useOrderSheetAbleCoupons();

  const {
    draftCouponSelection,
    discountAmount,
    changeCouponSelection,
    updateCouponSelection,
  } = useOrderSheetCouponSelection({
    couponSelection,
    updateCouponSelection: updateCouponSelectionActions,
  });

  const couponViewModels = coupons?.map((coupon) => {
    const isAble = ableCoupons?.includes(coupon.code);
    const isSelected = draftCouponSelection.includes(coupon.id);

    return { ...coupon, isAble, isSelected };
  });

  return {
    coupons: couponViewModels,
    discountAmount,
    changeCouponSelection,
    updateCouponSelection,
  };
};
