import { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { useCheckout } from "../features/checkout/useCheckout";
import { useCheckedProductIds } from "../features/checkout/useCheckedProductIds";
import { toCheckoutItems } from "../entites/checkout/lib";
import { Header } from "../shared/Header";
import { Spinner } from "../shared/Spinner";
import { ErrorInfo } from "../shared/ErrorInfo";
import { BottomButton } from "../shared/BottomButton";
import { Modal } from "../shared/Modal";
import { PageTitle } from "../shared/PageTitle";
import { CheckoutSection } from "../features/checkout/CheckoutSection";
import { DeliveryInfo } from "../features/checkout/DeliveryInfo";
import { CheckoutSummary } from "../features/checkout/CheckoutSummary";
import { CouponSelect } from "../features/checkout/CouponSelect";

export const CheckoutPage = () => {
  const checkedProductIds = useCheckedProductIds();

  const [hardDeliveryPlace, setHardDeliveryPlace] = useState(false);
  const [selectedCouponIds, setSelectedCouponIds] = useState<string[]>([]);
  const { state } = useCheckout(checkedProductIds, hardDeliveryPlace, selectedCouponIds);
  const navigate = useNavigate();
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

  if (checkedProductIds.length === 0) {
    return <Navigate to="/" replace />;
  }

  const closeCouponModal = () => setIsCouponModalOpen(false);

  const handleOrder = () => {
    if (state.status !== "success") return;
    navigate("/result", {
      state: {
        items: state.data.selectedItems,
        gifts: state.data.gifts,
        totalPrice: state.data.priceSummary.totalPrice,
      },
    });
  };

  return (
    <>
      <Header logo={"<-"} onClick={() => navigate(-1)} />
      {state.status === "loading" && <Spinner />}
      {state.status === "error" && <ErrorInfo message={state.error} />}
      {state.status === "success" && (
        <>
          <PageTitle
            title="주문 확인"
            subtitle={
              <>
                총 {state.data.selectedItems.length}종류의 상품{" "}
                {state.data.selectedItems.reduce((sum, item) => sum + item.quantity, 0)}개를
                주문합니다.
                <br />
                최종 결제 금액을 확인해 주세요.
              </>
            }
          />
          <CheckoutSection
            items={toCheckoutItems(state.data.selectedItems, state.data.gifts)}
            onOpenCoupon={() => setIsCouponModalOpen(true)}
          />
          <DeliveryInfo
            checked={hardDeliveryPlace}
            onToggle={() => setHardDeliveryPlace((prev) => !prev)}
          />
          <CheckoutSummary {...state.data.priceSummary} />
          <Modal isOpen={isCouponModalOpen} onClose={closeCouponModal}>
            <Modal.Header>
              <Modal.Title>쿠폰을 선택해 주세요</Modal.Title>
              <Modal.Close onClose={closeCouponModal}>X</Modal.Close>
            </Modal.Header>
            <CouponSelect
              coupons={state.data.couponsInfo}
              orderPrice={state.data.priceSummary.orderPrice}
              onApply={(selectedIds) => {
                setSelectedCouponIds(selectedIds);
                closeCouponModal();
              }}
            />
          </Modal>
        </>
      )}
      <BottomButton onClick={handleOrder} text="결제하기" />
    </>
  );
};
