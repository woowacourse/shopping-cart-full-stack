import { useState } from "react";
import CheckoutItemList from "./CheckoutItemList/CheckoutItemList";
import CheckoutPaymentSummary from "./CheckoutPaymentSummary";

import CheckoutCouponModal from "./CheckoutCouponModal/CheckoutCouponModal";

import { useNavigate, useParams } from "react-router-dom";
import { useCheckoutContent } from "./useCheckoutContent";
import BaseButton from "../../shared/components/BaseButton";
import useAsyncTask from "../../shared/useAsyncTask";

import { getCheckoutAllItemCount } from "../../domain/checkout/checkout.util";
import { typography } from "../../shared/styles/typography";
import Header from "../../shared/components/Header";
import BaseCheckBox from "../../shared/components/BaseCheckBox";
import { css } from "@emotion/react";
import ArrowBackIcon from "../../assets/arrow_back.png";
import {
  getCouponValidation,
  type CheckoutItem,
} from "../../domain/checkout/checkout.api";

const CheckoutPage = () => {
  const { checkoutId } = useParams();
  if (!checkoutId) return "잘못된 접근입니다.";
  const navigate = useNavigate();
  const {
    getCheckoutContentAsyncState,
    requestUpdateCheckoutRemoteArea,
    remoteAreaAsyncState,
    applyRemoteAreaResult,
    applyCheckoutCouponResult,
  } = useCheckoutContent(Number(checkoutId));

  const [isCheckoutCouponModalOpen, setIsCheckoutCouponModalOpen] =
    useState(false);

  const checkoutContent = getCheckoutContentAsyncState.data;

  if (!checkoutContent) return "로딩중...";
  const {
    checkoutItems,
    remoteArea,
    orderPrice,
    deliveryFee,
    couponDiscountPrice,
    totalPrice,
  } = checkoutContent;

  const handleRemoteAreaSelect = (nextSelect: boolean) => {
    requestUpdateCheckoutRemoteArea(nextSelect, {
      onSuccess: ({
        remoteArea,
        couponDiscountPrice,
        deliveryFee,
        totalPrice,
      }) =>
        applyRemoteAreaResult({
          remoteArea,
          couponDiscountPrice,
          deliveryFee,
          totalPrice,
        }),
      onFail: (error) => alert(error.message),
      showLoading: true,
    });
  };

  return (
    <div
      css={css({
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "64px 24px",
      })}
    >
      <Header
        actionIcon={
          <button
            type="button"
            onClick={() => navigate(-1)}
            css={css({
              width: "20px",
              height: "20px",
              border: "none",
              background: "none",
              cursor: "pointer",
            })}
          >
            <img src={ArrowBackIcon} alt="뒤로가기" />
          </button>
        }
      />
      <div css={[typography.titleLarge, { marginTop: "24px" }]}>주문 확인</div>
      <div
        css={typography.bodyMedium}
      >{`총 ${checkoutItems.length}종류의 상품 ${getCheckoutAllItemCount(checkoutItems)}개를 주문합니다.`}</div>
      <div css={typography.bodyMedium}>최종 결제금액을 확인해 주세요.</div>

      <CheckoutItemList checkoutItems={checkoutItems} />

      <BaseButton
        onClick={() => setIsCheckoutCouponModalOpen(true)}
        style={"white"}
        display="full"
        rounded="md"
      >
        쿠폰 적용
      </BaseButton>

      <div css={typography.titleMedium}>배송 정보</div>
      <label
        css={[
          typography.bodyMedium,
          css({
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
            gap: "4px",
          }),
        ]}
      >
        <BaseCheckBox
          isSelected={remoteArea}
          disabled={remoteAreaAsyncState.status === "loading"}
          onSelect={handleRemoteAreaSelect}
        />
        제주도 및 도서 산간 지역
      </label>

      <CheckoutPaymentSummary
        orderPrice={orderPrice}
        couponDiscountPrice={couponDiscountPrice}
        deliveryFee={deliveryFee}
        totalPrice={totalPrice}
      />
      <div
        css={css({
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          zIndex: 1,
        })}
      >
        <PaymentButton
          checkoutId={Number(checkoutId)}
          checkoutItems={checkoutItems}
          totalPrice={totalPrice}
        />
      </div>

      <CheckoutCouponModal
        checkoutId={Number(checkoutId)}
        isCheckoutCouponModalOpen={isCheckoutCouponModalOpen}
        onCloseModal={() => setIsCheckoutCouponModalOpen(false)}
        checkoutItems={checkoutItems}
        orderPrice={orderPrice}
        deliveryFee={deliveryFee}
        applyCheckoutCouponResult={applyCheckoutCouponResult}
      />
    </div>
  );
};

export default CheckoutPage;

const PaymentButton = ({
  checkoutId,
  checkoutItems,
  totalPrice,
}: {
  checkoutId: number;
  checkoutItems: CheckoutItem[];
  totalPrice: number;
}) => {
  const navigate = useNavigate();

  const {
    asyncState: requestPaymentAsyncState,
    executeAsyncFunction: executePayment,
  } = useAsyncTask<void>();

  const handlePaymentButtonClick = async () => {
    await executePayment({
      asyncFunction: () => getCouponValidation(Number(checkoutId)),
      options: {
        onSuccess: () => {
          navigate("/order-complete", {
            state: {
              checkoutItems,
              totalPrice,
            },
          });
        },
        onFail: (error) => alert(error.message),
        showLoading: true,
      },
    });
  };
  return (
    <BaseButton
      onClick={handlePaymentButtonClick}
      disabled={requestPaymentAsyncState.status === "loading"}
      style={"black"}
      display="full"
      rounded="none"
    >
      결제하기
    </BaseButton>
  );
};
