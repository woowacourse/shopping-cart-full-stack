import { useOrderSheetData } from "./useOrderSheetData";
import { useOrderSheetPricing } from "./useOrderSheetPricing";
import { useOrderSheetIsRemoteArea } from "./useOrderSheetIsRemoteArea";
import { useOrderSheetCouponSelection } from "./useOrderSheetCouponSelection";

export const useOrderSheet = () => {
  const orderSheetLoadData = useOrderSheetData();
  const { products, totalCount, isRemoteArea, couponSelection } =
    orderSheetLoadData;

  const { updateIsRemoteAreaMutate } = useOrderSheetIsRemoteArea({
    onUpdate: () => {
      orderSheetLoadData.refetch();
      pricingLoadData.refetch();
    },
  });

  const updateIsRemoteArea = async ({
    isRemoteArea,
  }: {
    isRemoteArea: boolean;
  }) => {
    await updateIsRemoteAreaMutate(isRemoteArea);
  };

  const { updateSelectedCouponsMutate } = useOrderSheetCouponSelection({
    onUpdate: () => {
      orderSheetLoadData.refetch();
      pricingLoadData.refetch();
    },
  });

  const updateCouponSelection = async ({
    couponSelection,
  }: {
    couponSelection: number[];
  }) => {
    await updateSelectedCouponsMutate(couponSelection);
  };

  const pricingLoadData = useOrderSheetPricing();
  const { pricing, paymentAmount } = pricingLoadData;

  return {
    products,
    totalCount,

    isRemoteArea,

    couponSelection,

    pricing,
    paymentAmount,

    updateIsRemoteArea,
    updateCouponSelection,
  };
};
