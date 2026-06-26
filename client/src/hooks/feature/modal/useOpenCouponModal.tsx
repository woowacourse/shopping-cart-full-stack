/* eslint-disable react-refresh/only-export-components */
import { useModalContext } from "@/service/modal";
import info from "@assets/info.svg";
import Spacing from "@components/common/shared/layout/Spacing";
import Button from "@components/common/shared/ui/Button";
import CheckBox from "@components/common/shared/ui/CheckBox";
import Divider from "@components/common/shared/ui/Divider";
import styled from "@emotion/styled";
import useDiscountPriceMutation from "@hooks/feature/mutation/useDiscountPriceMutation";
import useOrderUpdateMutation from "@hooks/feature/mutation/useOrderUpdateMutation";
import useCouponsQuery from "@hooks/feature/query/useCouponsQuery";
import useOrderQuery from "@hooks/feature/query/useOrderQuery";
import { Fragment, Suspense, useRef, useState } from "react";

const MAX_COUPON_COUNT = 2;

function useOpenCouponModal() {
  const { addModal, closeModal } = useModalContext();

  const openCouponModal = () => {
    addModal(
      <Suspense>
        <ModalContent close={closeModal} />
      </Suspense>,
    );
  };

  return { openCouponModal };
}

function ModalContent({ close }: { close: () => void }) {
  const { data: coupons } = useCouponsQuery();
  const {
    data: {
      couponIds: appliedCouponIds,
      priceInfo: { discountPrice },
    },
  } = useOrderQuery();
  const { mutate: calculateDiscountPrice } = useDiscountPriceMutation();
  const { mutate: updateOrder } = useOrderUpdateMutation();

  const [selectedCoupons, setSelectedCoupons] =
    useState<string[]>(appliedCouponIds);
  const [discountAmount, setDiscountAmount] = useState<number>(discountPrice);

  const latestRequestIdRef = useRef(0);

  const handleApplyCoupon = (couponIds: string[]) => {
    const requestId = ++latestRequestIdRef.current;

    calculateDiscountPrice(
      { couponIds },
      {
        onSuccess: ({ discountPrice }) => {
          if (requestId !== latestRequestIdRef.current) return;
          setDiscountAmount(discountPrice);
        },
      },
    );
  };

  const handleConfirm = () => {
    updateOrder({ couponIds: selectedCoupons }, { onSuccess: () => close() });
  };

  return (
    <>
      <DimmedBackground onClick={close} />
      <ModalContainer>
        <ModalHeaderWrapper>
          <ModalHeader>쿠폰을 선택해 주세요</ModalHeader>
          <ModalCloseButton onClick={close}>×</ModalCloseButton>
        </ModalHeaderWrapper>
        <Spacing size={2} />
        <CouponInfoWrapper>
          <InfoIcon src={info} alt="정보" />
          <InfoText>
            쿠폰은 최대 {MAX_COUPON_COUNT}개까지 사용할 수 있습니다.
          </InfoText>
        </CouponInfoWrapper>
        <Spacing size={1} />
        <Divider />
        <CouponList>
          {coupons?.map(
            ({
              couponExpiration,
              couponId,
              couponName,
              isDisabled,
              option,
            }) => (
              <Fragment key={couponId}>
                <Spacing size={0.75} />
                <CouponItem key={couponId} isDisabled={isDisabled}>
                  <CouponItemTitleWrapper>
                    <CheckBox
                      checked={selectedCoupons.includes(couponId)}
                      disabled={
                        isDisabled ||
                        (selectedCoupons.length >= MAX_COUPON_COUNT &&
                          !selectedCoupons.includes(couponId))
                      }
                      onChange={(e) => {
                        const isChecked = e.target.checked;

                        if (!isChecked) {
                          const newSelectedCoupons = selectedCoupons.filter(
                            (id) => id !== couponId,
                          );
                          setSelectedCoupons(newSelectedCoupons);
                          handleApplyCoupon(newSelectedCoupons);
                          return;
                        }

                        const newSelectedCoupons = [
                          ...selectedCoupons,
                          couponId,
                        ];

                        setSelectedCoupons(newSelectedCoupons);
                        handleApplyCoupon(newSelectedCoupons);
                      }}
                    />
                    <CouponItemTitle>{couponName}</CouponItemTitle>
                  </CouponItemTitleWrapper>
                  <Spacing size={0.25} />
                  <CouponItemDescription>
                    만료일 : {new Date(couponExpiration).toLocaleDateString()}
                  </CouponItemDescription>
                  <CouponItemDescription>{option}</CouponItemDescription>
                </CouponItem>
                <Spacing size={0.75} />
                <Divider />
              </Fragment>
            ),
          )}
        </CouponList>
        <Spacing size={1} />
        <ApplyButton fullWidth onClick={handleConfirm}>
          총 {discountAmount.toLocaleString()}원 할인 쿠폰 사용하기
        </ApplyButton>
      </ModalContainer>
    </>
  );
}

const DimmedBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 1.625rem 2rem;
  border-radius: 0.5rem;
  z-index: 1000;
  min-width: 22rem;
`;

const ModalHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalHeader = styled.h3`
  font-weight: 700;
  font-size: 1.125rem;
  line-height: 100%;
`;

const ModalCloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CouponInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const InfoIcon = styled.img`
  width: 0.875rem;
  aspect-ratio: 1/1;
`;

const InfoText = styled.span`
  font-weight: 500;
  font-size: 0.75rem;
  line-height: 0.9375rem;
`;

const CouponList = styled.ul`
  display: flex;
  flex-direction: column;
`;

const CouponItem = styled.li<{ isDisabled?: boolean }>`
  opacity: ${(props) => (props.isDisabled ? 0.5 : 1)};
`;

const CouponItemTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CouponItemTitle = styled.h4`
  font-weight: 700;
  font-size: 16px;
`;

const CouponItemDescription = styled.p`
  font-weight: 500;
  font-size: 12px;
`;

const ApplyButton = styled(Button)`
  padding-block: 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
`;

export default useOpenCouponModal;
