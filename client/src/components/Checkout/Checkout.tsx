import type { OrderSummaryResponseDto } from "../../apis/order.api.dto";
import Column from "../../commons/layout/Column/Column";
import CouponButton from "./CouponModal/CouponButton/CouponButton";
import OrderButton from "./OrderButton/OrderButton";
import OrderItems from "./OrderItems/OrderItems";
import OrderSummary from "./OrderSummary/OrderSummary";
import ShippingInfo from "./ShippingInfo/ShippingInfo";

interface Props {
  data: OrderSummaryResponseDto;
  refetch: () => Promise<void>;
}

const Checkout = ({ data, refetch }: Props) => {
  const {
    orderItems,
    orderAmount,
    couponDiscountAmount,
    shippingFee,
    totalPaymentAmount,
  } = data;

  const itemCount = orderItems.length;
  const totalQuantity = orderItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  return (
    <Column gap={32}>
      <OrderItems orderItems={orderItems} />
      <CouponButton refetch={refetch} />
      <ShippingInfo refetch={refetch} />
      <OrderSummary
        orderAmount={orderAmount}
        shippingFee={shippingFee}
        couponDiscountAmount={couponDiscountAmount}
        totalPaymentAmount={totalPaymentAmount}
      />
      <OrderButton
        itemCount={itemCount}
        totalQuantity={totalQuantity}
        totalAmount={totalPaymentAmount}
      />
    </Column>
  );
};

export default Checkout;
