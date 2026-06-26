import { formatPrice } from '../../utils/formatPrice';
import { getCartPayments } from '../../api/cart';
import { useQuery } from '../../api/useQuery';
import PaymentBill, { PaymentRow, PaymentBillSkeleton } from './PaymentBill';

export default function CartPaymentBill() {
  const { data, isLoading, isSuccess } = useQuery({
    queryFn: getCartPayments,
  });

  if (isLoading) {
    return <PaymentBillSkeleton />;
  }

  if (!isSuccess || !data) {
    return null;
  }

  const { orderPrice, shippingFee, totalPrice } = data.result;

  return (
    <PaymentBill totalPrice={`${formatPrice(totalPrice)}원`}>
      <PaymentRow label="주문 금액" value={`${formatPrice(orderPrice)}원`} />
      <PaymentRow label="배송비" value={`${formatPrice(shippingFee)}원`} />
    </PaymentBill>
  );
}
