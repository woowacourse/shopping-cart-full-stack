import useOrderCompleteNavigate from "@hooks/useOrderCompleteNavigate.ts";
import Button from "@components/common/shared/Button";
import useOrderQuery from "@/hooks/useOrderQuery";
import useOrderDiscountQuery from "@/hooks/useOrderDiscountQuery";

interface PaymentButtonProps {
  orderId: number;
}

export default function PaymentButton({ orderId }: PaymentButtonProps) {
  // TODO: order products / info api 분리 필요
  const { navigate } = useOrderCompleteNavigate();
  const { data: order } = useOrderQuery(orderId);
  const { data: discount } = useOrderDiscountQuery(orderId, { couponId: order.coupons ?? [] });

  const productCount = order.products.length;
  const totalQuantity = order.products.reduce((acc, p) => acc + p.quantity, 0);

  const totalOrderAmount = order.products.reduce((acc, p) => acc + p.price * p.quantity, 0);
  const discountAmount = discount.discountAmount;
  const deliveryFee = order.deliveryFee ?? 0;
  const totalAmount = totalOrderAmount - discountAmount + deliveryFee;

  return (
    <Button fullWidth onClick={() => navigate({ productCount, totalQuantity, totalAmount })}>
      결제하기
    </Button>
  );
}
