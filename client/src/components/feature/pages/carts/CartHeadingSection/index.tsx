import SectionIntro from "@components/common/shared/ui/SectionIntro";
import useCartQuery from "@hooks/feature/query/useCartQuery";

import CartHeadingSectionSkeleton from "./skeleton";

function CartHeadingSection() {
  const { data: cartData } = useCartQuery();

  const productCount = cartData.length;

  const title = "장바구니";
  const description =
    cartData.length > 0
      ? [`총 ${productCount}종류의 상품이 담겨있습니다.`]
      : undefined;

  return <SectionIntro title={title} description={description} />;
}

CartHeadingSection.Skeleton = CartHeadingSectionSkeleton;

export default CartHeadingSection;
