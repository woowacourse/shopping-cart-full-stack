import { css } from "@emotion/react";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useBlocker, useNavigate, useParams } from "react-router";
import Button from "../components/Button";
import Checkbox from "../components/Checkbox";
import CheckoutItem from "../components/CheckoutItem";
import CheckoutSummary from "../components/CheckoutSummary";
import CouponModal from "../components/CouponModal";
import ErrorList from "../components/ErrorList";
import Header from "../components/Header";
import SkeletonList from "../components/SkeletonList";
import { ROUTES } from "../constants/routes";
import { useCheckout } from "../hooks/useCheckout";
import { useUpdateCheckout } from "../hooks/useUpdateCheckout";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { checkoutId: checkoutIdParam } = useParams();
  const checkoutId = Number(checkoutIdParam);

  const {
    isLoading,
    hasError,
    checkoutItemList,
    couponList,
    orderAmount,
    couponDiscount,
    shippingFee,
    totalAmount,
    remoteArea,
    refetch,
    cancelCheckout,
    submitCheckout,
  } = useCheckout(checkoutId);

  const { updateRemoteArea, updateAppliedCoupon, pending: isUpdating } = useUpdateCheckout(checkoutId);

  const [isCouponModalOpened, setCouponModalOpened] = useState(false);

  const isSuccessfullyPaidRef = useRef(false);

  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    return !isSuccessfullyPaidRef.current && currentLocation.pathname !== nextLocation.pathname;
  });

  useEffect(() => {
    if (blocker.state !== "blocked") return; // blocked: 구매하지 않고 나가는 경우, unblocked/proceeding: 그 외.
    cancelCheckout().catch(() => {}); // 임시주문에서 삭제
    blocker.proceed(); // 하려던거 계속 진행
  }, [blocker, cancelCheckout]);

  const isLoaded = !isLoading && !hasError;
  const itemTypeCount = checkoutItemList.length;
  const totalQuantity = checkoutItemList.reduce((sum, item) => sum + item.quantity, 0);

  const handleToggleRemoteArea = (e: ChangeEvent<HTMLInputElement>) => {
    updateRemoteArea(e.target.checked);
  };

  const handleCloseModal = () => {
    setCouponModalOpened(false);
  };

  const handleSubmitCheckout = async () => {
    const summary = await submitCheckout();
    isSuccessfullyPaidRef.current = true;
    navigate(ROUTES.ORDER_SUCCESS, { state: summary, replace: true });
  };

  return (
    <div css={pageStyle}>
      <Header>
        <Header.BackButton />
      </Header>
      <main css={mainStyle}>
        <h1 className="typo-xl-b">주문 확인</h1>
        {isLoading && <SkeletonList />}
        {hasError && <ErrorList onRetry={refetch} />}
        {isLoaded && (
          <div css={contentStyle}>
            <p className="typo-sm-r">
              총 {itemTypeCount}종류의 상품 {totalQuantity}개를 주문합니다.
              <br />
              최종 결제 금액을 확인해 주세요.
            </p>

            <ul css={checkoutItemListStyle}>
              {checkoutItemList.map((item) => (
                <li key={item.productId}>
                  <CheckoutItem item={item} />
                </li>
              ))}
            </ul>

            <div css={couponButtonWrapperStyle}>
              <Button variant="secondary" radius="sm" disabled={isUpdating} onClick={() => setCouponModalOpened(true)}>
                <span className="typo-md-b">쿠폰 적용</span>
              </Button>
            </div>

            <section css={sectionStyle}>
              <h3 className="typo-md-b">배송 정보</h3>
              <Checkbox checked={remoteArea} disabled={isUpdating} onChange={handleToggleRemoteArea}>
                <span className="typo-sm-r">제주도 및 도서 산간 지역</span>
              </Checkbox>
            </section>

            <CheckoutSummary
              orderAmount={orderAmount}
              couponDiscount={couponDiscount}
              shippingFee={shippingFee}
              totalAmount={totalAmount}
            />

            {isCouponModalOpened && (
              <CouponModal
                checkoutId={checkoutId}
                couponList={couponList}
                initialCouponDiscount={couponDiscount}
                onApplyCoupon={updateAppliedCoupon}
                onClose={handleCloseModal}
              />
            )}
          </div>
        )}
      </main>
      <footer css={footerStyle}>
        <Button onClick={handleSubmitCheckout} disabled={!isLoaded}>
          <span className="typo-md-b">결제하기</span>
        </Button>
      </footer>
    </div>
  );
}

const pageStyle = css`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const mainStyle = css`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 36px 24px;
  gap: 12px;
`;

const contentStyle = css`
  display: flex;
  flex-direction: column;
  gap: 36px;
`;

const checkoutItemListStyle = css`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const couponButtonWrapperStyle = css`
  height: 48px;
  flex-shrink: 0;
  margin-top: -20px;
`;

const sectionStyle = css`
  display: flex;
  flex-direction: column;
  justify-contents: center;
  gap: 16px;
`;

const footerStyle = css`
  flex-shrink: 0;
  height: 56px;
`;
