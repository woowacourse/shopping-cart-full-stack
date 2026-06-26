import { useState } from "react";
import { useNavigate } from "react-router";
import styled from "@emotion/styled";
import { FixedButton } from "../../../commons/styles/Button";
import OrderItemList from "./OrderItemList";
import Checkbox from "../../../commons/components/Checkbox";
import PriceSummary from "../../../commons/components/PriceSummary";
import Info from "../../../commons/images/info.svg?react";
import CouponSelectModal from "./CouponSelectModal";
import useOrder from "../hooks/useOrder";
import useCoupons from "../hooks/useCoupons";
import NetworkError from "../../../commons/components/NetworkError";
import Spinner from "../../../commons/components/Spinner";

interface Props {
  orderId: string;
}

export default function Section({ orderId }: Props) {
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

  const { loadStatus, order, updateOrder } = useOrder(orderId);
  const { coupons, maxCouponCount, getCoupons } = useCoupons(orderId);

  const navigate = useNavigate();

  const orderItemsTypeLength = order?.selected_items.length ?? 0;
  const orderItemsLength =
    order?.selected_items.reduce((count, item) => count + item.quantity, 0) ??
    0;

  function goToPurchaseCheckPage() {
    if (order)
      navigate(`/cart/check/purchase/`, {
        state: {
          orderItemsTypeLength,
          orderItemsLength,
          totalPrice: order.price_summary.total_price,
        },
      });
  }

  return (
    <SectionLayout>
      {loadStatus === "loading" && <Spinner />}
      {loadStatus === "success" && order && (
        <>
          <Title>주문 확인</Title>
          <SubText>
            총 {orderItemsTypeLength}종류의 상품 {orderItemsLength}
            개를 주문합니다.
          </SubText>
          <SubText>최종 결제 금액을 확인해 주세요.</SubText>
          <OrderItemList items={order.selected_items} />
          <CouponApplyButton
            onClick={async () => {
              setIsCouponModalOpen(true);
              await getCoupons();
            }}
          >
            쿠폰 적용
          </CouponApplyButton>
          <CouponSelectModal
            orderId={orderId}
            selectedCoupons={order.selected_coupons}
            coupons={coupons}
            maxCouponCount={maxCouponCount}
            initialDiscountPrice={order.price_summary.discount_price}
            updateOrder={updateOrder}
            isOpen={isCouponModalOpen}
            onClose={() => setIsCouponModalOpen(false)}
          />
          <DeliveryOption>
            <p>배송 정보</p>
            <Checkbox
              labelText={"제주도 및 도서 산간 지역"}
              checked={order.hard_delivery_place}
              onChange={() =>
                updateOrder({ hard_delivery_place: !order.hard_delivery_place })
              }
            ></Checkbox>
          </DeliveryOption>
          <SubText className="icon-text">
            <Info aria-label="정보" />총 주문 금액이 100,000원 이상일 경우 무료
            배송됩니다.
          </SubText>
          <PriceSummary
            rows={[
              { label: "주문 금액", value: order.price_summary.order_price },
              {
                label: "쿠폰 할인 금액",
                value: order.price_summary.discount_price,
              },
              { label: "배송비", value: order.price_summary.delivery_price },
            ]}
            total={{
              label: "총 결제 금액",
              value: order.price_summary.total_price,
            }}
          />
          <FixedButton type="button" onClick={goToPurchaseCheckPage}>
            결제하기
          </FixedButton>
        </>
      )}
      {loadStatus === "error" && <NetworkError />}
    </SectionLayout>
  );
}

const SectionLayout = styled.section`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1.5rem;
  margin-bottom: 4rem;
  overflow: scroll;

  .icon-text {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 8px;
  }
`;

const Title = styled.h2`
  font-weight: 700;
  font-size: 24px;
`;

const SubText = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 12px;
  margin: 2px 0;
`;

const CouponApplyButton = styled.button`
  background-color: transparent;
  font-weight: 700;
  padding: 1rem 0;
  font-size: 16px;
  text-align: center;
  color: #333333bf;
  border: solid #333333bf 1px;
  border-radius: 5px;
  width: 100%;
  max-width: 768px;
`;

const DeliveryOption = styled.div`
  padding: 2rem 0;
  p {
    font-weight: 700;
    font-size: 16px;
  }
`;
