import OrderAmount from "@components/common/shared/ui/OrderAmount";
import useOrderQuery from "@hooks/feature/query/useOrderQuery";

function OrderConfirmAmountSection() {
  const {
    data: { priceInfo },
  } = useOrderQuery();

  const { orderPrice, deliveryFee, discountPrice, totalPrice } = priceInfo;

  return (
    <OrderAmount
      orderAmount={orderPrice}
      deliveryFee={deliveryFee}
      totalAmount={totalPrice}
      discountAmount={discountPrice}
    />
  );
}

export default OrderConfirmAmountSection;
