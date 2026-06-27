import styled from 'styled-components';
import { Checkbox, Description, Title } from '../../../shared/styles/common';
import type { OrderResponse } from '../../../api/orderDraft/orderApi.types';
import { OrderSummary } from './OrderSummary';
import { useModal } from '../hooks/useModal';
import { CouponModal } from './CouponModal';
import { CouponsProvider } from '../context/CouponProvider';
import { OrderItem } from './OrderItem';

export type PriceContextType = {
  orderPrice: number;
  productDiscountPrice: number;
  deliveryFee: number;
  totalPrice: number;
};

export const OrderSuccessView = ({
  data,
  loadOrder,
  changeOrderIsIsland,
}: {
  data: OrderResponse;
  loadOrder: () => void;
  changeOrderIsIsland: (isIsland: boolean) => void;
}) => {
  // 총 상품 종류 개수
  const productKind = data.products.length;
  // 총 상품 개수
  const productCount = data.products.reduce((sum, product) => {
    return sum + product.quantity;
  }, 0);

  // 가격 정보
  const {
    orderPrice,
    productDiscountPrice,
    deliveryDiscountPrice,
    deliveryFee,
    totalPrice,
  } = data.priceInfo;
  const priceContext: PriceContextType = {
    orderPrice: orderPrice,
    productDiscountPrice: productDiscountPrice,
    deliveryFee: deliveryFee - deliveryDiscountPrice,
    totalPrice: totalPrice,
  };

  const overlay = useModal(({ close }) => (
    <CouponsProvider orderId={data.orderId} appliedCouponIds={data.couponIds}>
      <CouponModal>
        <CouponModal.Header onClose={close} />
        <CouponModal.Notice />
        <CouponModal.List />
        <CouponModal.ApplyButton onClose={close} onRefresh={loadOrder} />
      </CouponModal>
    </CouponsProvider>
  ));

  return (
    <Section>
      <SectionHeader>
        <Title>주문 확인</Title>
        <Description>
          총 {productKind}종류의 상품 {productCount}개를 주문합니다. <br />
          최종 결제 금액을 확인해 주세요.
        </Description>
      </SectionHeader>

      <SectionContent>
        <OrderItemList>
          {data.products.map((product) => (
            <OrderItem key={product.productId} product={product} />
          ))}
        </OrderItemList>

        <CouponApplyButton onClick={() => overlay.open()}>
          쿠폰 적용
        </CouponApplyButton>

        <DeliveryInfo>
          <DeliveryText>배송 정보</DeliveryText>
          <CheckboxInfo>
            <Checkbox
              type="checkbox"
              checked={data.isIsland}
              onChange={(event) =>
                changeOrderIsIsland(event.currentTarget.checked)
              }
            />
            <CheckboxText htmlFor="">제주도 및 도서 산간 지역</CheckboxText>
          </CheckboxInfo>
        </DeliveryInfo>
      </SectionContent>

      <OrderSummary priceContext={priceContext} />
      {overlay.modal}
    </Section>
  );
};

const Section = styled.section`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;

  gap: 20px;
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 10px;
`;

const SectionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const OrderItemList = styled.div`
  max-height: 200px;
  overflow-y: auto;
`;

const CouponApplyButton = styled.button`
  padding: 10px 0px;
  font-size: 16px;
  font-weight: 700;
  color: #333333bf;
  background-color: white;

  border-radius: 4px;
  border: 1px solid #33333340;
`;

const DeliveryInfo = styled.div`
  display: flex;
  flex-direction: column;

  gap: 10px;
`;
const DeliveryText = styled.span`
  font-size: 20px;
  font-weight: 750;
`;
const CheckboxInfo = styled.label`
  display: flex;
  gap: 6px;
`;
const CheckboxText = styled.label`
  font-size: 14px;
  font-weight: 700;

  text-align: center;
`;
