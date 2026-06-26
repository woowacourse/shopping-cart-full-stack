import SectionIntro from "@/components/common/shared/ui/SectionIntro";
import useOrderQuery from "@/hooks/feature/query/useOrderQuery";

function OrderConfirmHeading() {
  const { data } = useOrderQuery();

  const products = data.orderProducts;

  const productCount = products.length;
  const totalQuantity = products.reduce(
    (sum, { quantity }) => sum + quantity,
    0,
  );

  return (
    <SectionIntro
      title="주문 확인"
      description={[
        `총 ${productCount}종류의 상품 ${totalQuantity}개를 주문합니다.`,
        `최종 결제 금액을 확인해 주세요.`,
      ]}
    />
  );
}

export default OrderConfirmHeading;
