import styled from '@emotion/styled';
import { useState } from 'react';
import OrderHeader from '../components/Order/OrderHeader';
import { useQuery } from '../api/useQuery';
import { getOrderList, updateOrder } from '../api/order';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import OrderItemList from '../components/Order/OrderItemList';
import RemoteAreaShippingToggle from '../components/Order/RemoteAreaShippingToggle';
import PaymentBill, { PaymentRow } from '../components/Order/PaymentBill';
import CouponSelectModal from '../components/Coupon/CouponSelectModal';
import { formatPrice } from '../utils/formatPrice';

export default function OrderConfirmPage() {
  const navigate = useNavigate();
  const { id: orderId } = useParams();
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

  const { data, refetch } = useQuery({
    queryFn: () => getOrderList(Number(orderId)),
  });
  const orders = data?.result.products ?? [];
  const totalQuantity = orders.reduce((acc, curr) => acc + curr.orderCount, 0);

  const handleToggleRemoteArea = async (next: boolean) => {
    try {
      if (data) {
        await updateOrder(data.result.id, next);
        refetch();
      }
    } catch (err) {
      if (err instanceof Error) alert(err.message);
    }
  };

  const handlePayment = () => {
    if (!data) return;

    navigate(`/payment/${orderId}`, {
      replace: true,
      state: {
        productTypeCount: orders.length,
        totalQuantity,
        totalPrice: data.result.payment.totalPrice,
      },
    });
  };

  if (Number.isNaN(Number(orderId))) return <Navigate to="/" replace={true} />;

  if (!data) return null;

  return (
    <Container>
      <OrderHeader
        productTypeCount={orders.length}
        totalQuantity={totalQuantity}
      />
      <OrderItemList orders={orders} />
      <ApplyCouponButton onClick={() => setIsCouponModalOpen(true)}>
        쿠폰 적용
      </ApplyCouponButton>

      {isCouponModalOpen && (
        <CouponSelectModal
          orderId={data.result.id}
          onClose={() => setIsCouponModalOpen(false)}
          onApplied={refetch}
        />
      )}

      <RemoteAreaShippingToggle
        onToggle={handleToggleRemoteArea}
        isSelected={data.result.isRemoteArea}
      />

      <PaymentBill
        totalPrice={`${formatPrice(data.result.payment.totalPrice)}원`}
      >
        <PaymentRow
          label="주문 금액"
          value={`${formatPrice(data.result.payment.orderPrice)}원`}
        />
        <PaymentRow
          label="쿠폰 할인 금액"
          value={`-${formatPrice(data.result.payment.discountAmount)}원`}
        />
        <PaymentRow
          label="배송비"
          value={`${formatPrice(data.result.payment.shippingFee)}원`}
        />
      </PaymentBill>

      <PaymentButton onClick={handlePayment}>결제하기</PaymentButton>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const ApplyCouponButton = styled.button`
  width: 100%;
  height: 48px;
  border: 1px solid #33333340;
  border-radius: 5px;
  font-size: 15px;
  font-weight: 700;
  color: #333333bf;
  background-color: #fff;
  margin-bottom: 32px;
`;

const PaymentButton = styled.button`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  min-width: 430px;
  max-width: 1280px;
  width: 100%;
  height: 64px;
  background-color: #000;
  color: #fff;

  &:disabled {
    background-color: #bebebe;
    cursor: not-allowed;
  }
`;
