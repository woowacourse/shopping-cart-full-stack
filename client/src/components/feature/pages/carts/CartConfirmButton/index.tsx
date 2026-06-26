import type { Product } from "@/types/cartProduct";
import Button from "@components/common/shared/ui/Button";
import useCheckedProductItems from "@hooks/feature/localStorageValue/useCheckedProductItems";
import useOrderCreateMutation from "@hooks/feature/mutation/useOrderCreateMutation";
import useOrderConfirmNavigate from "@hooks/feature/navigate/useOrderConfirmNavigate";
import useCartQuery from "@hooks/feature/query/useCartQuery";

import CartConfirmButtonSkeleton from "./skeleton";

function CartConfirmButton() {
  const { data: cartData } = useCartQuery();
  const { mutate: createOrder } = useOrderCreateMutation();
  const { navigate: goOrderConfirm } = useOrderConfirmNavigate();
  const { checkedItems } = useCheckedProductItems<Product["id"]>();

  const isChecked = (id: string) => checkedItems.includes(id);

  const handleConfirm = () => {
    const orderProducts = cartData
      .filter(({ product }) => isChecked(product.id))
      .map(({ product, quantity }) => ({
        productId: product.id,
        quantity,
      }));

    createOrder({ orderProducts }, { onSuccess: goOrderConfirm });
  };

  return (
    <Button
      fullWidth
      disabled={checkedItems.length === 0}
      onClick={handleConfirm}
    >
      주문 확인
    </Button>
  );
}

CartConfirmButton.Skeleton = CartConfirmButtonSkeleton;

export default CartConfirmButton;
