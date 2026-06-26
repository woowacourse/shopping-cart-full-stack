import type {
  CheckoutApplyCouponResponse,
  CheckoutContent,
  CheckoutCoupon,
  CheckoutItem,
} from "../../../domain/checkout/checkout.api";
import CheckoutCouponList from "./CheckoutCouponList/CheckoutCouponList";
import useCheckoutCoupon from "./useCheckoutCoupon";
import { css } from "@emotion/react";
import { typography } from "../../../shared/styles/typography";
import useSelectedCheckoutCoupon from "./useSelectedCheckoutCoupon";
import type {
  AsyncState,
  ExecuteAsyncFunctionProps,
} from "../../../shared/useAsyncTask";
import BaseButton from "../../../shared/components/BaseButton";
import { formatPrice } from "../../../shared/utils";
import { MAX_APPLY_COUPON_COUNT } from "../../../domain/checkout/checkout.constant";
import {
  getFilteredCoupon,
  getTotalCouponDiscountPrice,
} from "../../../domain/checkout/checkout.util";

const CheckoutCouponModal = ({
  checkoutId,
  isCheckoutCouponModalOpen,
  onCloseModal,
  checkoutItems,
  orderPrice,
  deliveryFee,
  applyCheckoutCouponResult,
}: {
  checkoutId: number;
  isCheckoutCouponModalOpen: boolean;
  onCloseModal: () => void;
  checkoutItems: CheckoutContent["checkoutItems"];
  orderPrice: CheckoutContent["orderPrice"];
  deliveryFee: CheckoutContent["deliveryFee"];
  applyCheckoutCouponResult: ({
    appliedCouponIds,
    couponDiscountPrice,
    deliveryFee,
    totalPrice,
  }: Pick<
    CheckoutContent,
    "appliedCouponIds" | "couponDiscountPrice" | "deliveryFee" | "totalPrice"
  >) => void;
}) => {
  const {
    getCheckoutCouponAsyncState,
    requestUpdateCheckoutApplyCoupon,
    updateApplyCouponAsyncState,
  } = useCheckoutCoupon(checkoutId);
  const { selectedCouponIds, addSelectedCouponId, deleteSelectedCouponId } =
    useSelectedCheckoutCoupon(getCheckoutCouponAsyncState);

  if (getCheckoutCouponAsyncState.status !== "success") return null;

  const { coupons } = getCheckoutCouponAsyncState.data;

  const handleSelectCoupon = (couponId: number, nextSelect: boolean) => {
    if (nextSelect && selectedCouponIds.length < MAX_APPLY_COUPON_COUNT) {
      addSelectedCouponId(couponId);
      return;
    }
    deleteSelectedCouponId(couponId);
  };

  if (!isCheckoutCouponModalOpen) return null;

  return (
    <section
      css={css({
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 10,
      })}
      onClick={(e) => {
        if (e.currentTarget === e.target) {
          onCloseModal();
        }
      }}
    >
      <article
        css={css({
          display: "flex",
          flexDirection: "column",
          border: "1px solid #fff",
          borderRadius: "4px",
          backgroundColor: "white",
          padding: "16px",
        })}
      >
        <div
          css={css({
            display: "flex",
            justifyContent: "space-between",
          })}
        >
          <span css={typography.titleMedium}>쿠폰을 선택해주세요</span>
          <button
            onClick={onCloseModal}
            css={css({
              border: "none",
              background: "none",
              cursor: "pointer",
              fontSize: "16px",
            })}
          >
            X
          </button>
        </div>

        <CheckoutCouponList
          coupons={coupons}
          selectedCouponIds={selectedCouponIds}
          onSelectCoupon={handleSelectCoupon}
          updateApplyCouponAsyncState={updateApplyCouponAsyncState}
        />

        <CheckoutCouponUseButton
          checkoutId={checkoutId}
          coupons={coupons}
          selectedCouponIds={selectedCouponIds}
          checkoutItems={checkoutItems}
          orderPrice={orderPrice}
          deliveryFee={deliveryFee}
          requestUpdateCheckoutApplyCoupon={requestUpdateCheckoutApplyCoupon}
          updateApplyCouponAsyncState={updateApplyCouponAsyncState}
          onCloseModal={onCloseModal}
          applyCheckoutCouponResult={applyCheckoutCouponResult}
        />
      </article>
    </section>
  );
};

export default CheckoutCouponModal;

const CheckoutCouponUseButton = ({
  coupons,
  selectedCouponIds,
  checkoutItems,
  orderPrice,
  deliveryFee,
  requestUpdateCheckoutApplyCoupon,
  updateApplyCouponAsyncState,
  onCloseModal,
  applyCheckoutCouponResult,
}: {
  checkoutId: number;
  coupons: CheckoutCoupon[];
  selectedCouponIds: number[];
  checkoutItems: CheckoutItem[];
  orderPrice: number;
  deliveryFee: number;
  requestUpdateCheckoutApplyCoupon: (
    nextCouponIds: number[],
    options: ExecuteAsyncFunctionProps<CheckoutApplyCouponResponse>["options"],
  ) => Promise<void>;
  updateApplyCouponAsyncState: AsyncState<CheckoutApplyCouponResponse>;
  onCloseModal: () => void;
  applyCheckoutCouponResult: ({
    appliedCouponIds,
    couponDiscountPrice,
    deliveryFee,
    totalPrice,
  }: Pick<
    CheckoutContent,
    "appliedCouponIds" | "couponDiscountPrice" | "deliveryFee" | "totalPrice"
  >) => void;
}) => {
  const selectedCoupons = getFilteredCoupon(coupons, selectedCouponIds);

  const totalCouponDiscountPrice = getTotalCouponDiscountPrice({
    selectedCoupons,
    checkoutItems,
    orderPrice,
    deliveryFee,
  });

  const handleUseCouponButtonClick = async () => {
    await requestUpdateCheckoutApplyCoupon(selectedCouponIds, {
      onSuccess: ({
        appliedCouponIds,
        couponDiscountPrice,
        deliveryFee,
        totalPrice,
      }) => {
        applyCheckoutCouponResult({
          appliedCouponIds,
          couponDiscountPrice,
          deliveryFee,
          totalPrice,
        });
        onCloseModal();
      },
      onFail: (error) => alert(error.message),
      showLoading: true,
    });
  };

  return (
    <BaseButton
      disabled={
        updateApplyCouponAsyncState.status === "loading" ||
        totalCouponDiscountPrice === 0
      }
      onClick={handleUseCouponButtonClick}
      style={"gray"}
      display="inline"
      rounded="md"
    >
      총 {formatPrice(totalCouponDiscountPrice)}원 할인 쿠폰 사용하기
    </BaseButton>
  );
};
