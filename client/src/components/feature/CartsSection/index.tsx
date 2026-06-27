import { type CartsErrorCode, CARTS_ERROR_MESSAGES } from "@/constants/errorMessages";
import type { Product } from "@/types/cartProduct";
import ApiError from "@apis/apiError.ts";
import CartHeading from "@components/common/entities/CartHeading";
import CartList from "@components/common/entities/CartList";
import CartOrderAmount from "@components/common/entities/CartOrderAmount";
import Button from "@components/common/shared/Button";
import Flex from "@components/common/shared/Flex";
import PositionBottom from "@components/common/shared/PositionBottom";
import Spacing from "@components/common/shared/Spacing";
import Text from "@components/common/shared/Text";
import styled from "@emotion/styled";
import useCartItemDeleteMutation from "@hooks/useCartItemDeleteMutation";
import useCartQuantityUpdateMutation from "@hooks/useCartQuantityUpdateMutation";
import useCartQuery from "@hooks/useCartQuery";
import useCheckedItems from "@hooks/useCheckedItems";
import useOrderFormNavigate from "@hooks/useOrderFormNavigate.ts";
import useOrderCreateMutation from "@/hooks/useOrderCreateMutation";
import { getCheckedItemsFromLocalStorage, setCheckedItemsToLocalStorage } from "./libs/localStorage";
import { calcDeliveryFee, calcOrderAmount, calcTotalAmount, makeCheckedItem } from "./libs/carts";
import { useEffect } from "react";

export default function CartsSection() {
  const { navigate } = useOrderFormNavigate();

  const { data } = useCartQuery();
  const { mutate: quantityMutate, error: quantityMutateError } = useCartQuantityUpdateMutation();
  const { mutate: deleteMutate, error: deleteMutateError } = useCartItemDeleteMutation();
  const { mutate: createOrder } = useOrderCreateMutation({
    onSuccess: (data) => {
      navigate({ orderId: data.orderId });
    },
  });

  const isCheckedItemsSaved = getCheckedItemsFromLocalStorage().length === 0;
  const initialCheckedItems = isCheckedItemsSaved ? makeCheckedItem(data) : getCheckedItemsFromLocalStorage();

  const { checkedItems, select, unselect, unselectAll } = useCheckedItems<Product["id"]>(initialCheckedItems);

  const isAllChecked = checkedItems.length === data.length;
  const isChecked = (id: number) => checkedItems.includes(id);

  const orderAmount = calcOrderAmount(data, checkedItems);
  const deliveryFee = calcDeliveryFee(orderAmount);
  const totalAmount = calcTotalAmount(orderAmount, deliveryFee);

  const handleSelectAll = () => {
    if (isAllChecked) {
      return unselectAll();
    }

    data.forEach(({ product }) => select(product.id));
  };

  const handleSelect = (id: number) => {
    if (isChecked(id)) {
      return unselect(id);
    }

    select(id);
  };

  const handleQuantityChange = (id: number, quantity: number) => {
    quantityMutate(id, quantity);
  };

  const handleDelete = (id: number) => {
    deleteMutate(id);
    setCheckedItemsToLocalStorage(checkedItems.filter((item) => item !== id));
    unselect(id);
  };

  const handleConfirm = () => {
    const selectedProducts = data
      .filter((item) => checkedItems.includes(item.product.id))
      .map((item) => ({
        id: item.product.id,
        quantity: item.quantity,
      }));

    createOrder({ products: selectedProducts });
  };

  useEffect(
    function persistCheckedItems() {
      setCheckedItemsToLocalStorage(checkedItems);
    },
    [checkedItems],
  );

  useEffect(
    function syncCartQuantityUpdateError() {
      if (!quantityMutateError) return;

      if (quantityMutateError instanceof ApiError) {
        const message = CARTS_ERROR_MESSAGES[quantityMutateError.code as CartsErrorCode] ?? quantityMutateError.message;
        alert(message);
      } else {
        alert(CARTS_ERROR_MESSAGES.DEFAULT);
      }
    },
    [quantityMutateError],
  );

  useEffect(
    function syncCartItemDeleteError() {
      if (!deleteMutateError) return;

      if (deleteMutateError instanceof ApiError) {
        const message = CARTS_ERROR_MESSAGES[deleteMutateError.code as CartsErrorCode] ?? deleteMutateError.message;
        alert(message);
      } else {
        alert(CARTS_ERROR_MESSAGES.DEFAULT);
      }
    },
    [deleteMutateError],
  );

  return (
    <ContentContainer direction="column">
      <Spacing size={2.25} />
      <CartHeading productCount={data.length} />
      <Spacing size={2.25} />
      {data.length !== 0 ? (
        <>
          <CartList
            cartProducts={data}
            checkedItems={checkedItems}
            onSelectAll={handleSelectAll}
            onSelect={handleSelect}
            quantityRange={{ min: 1, max: 99 }}
            onChangeQuantity={handleQuantityChange}
            onDelete={handleDelete}
          />
          <CartOrderAmount orderAmount={orderAmount} deliveryFee={deliveryFee} totalAmount={totalAmount} />
        </>
      ) : (
        <EmptyCartContainer align="center" justify="center">
          <Text typograph="body1" as="p">
            장바구니에 담은 상품이 없습니다.
          </Text>
        </EmptyCartContainer>
      )}
      <PositionBottom>
        <Button fullWidth disabled={checkedItems.length === 0} onClick={handleConfirm}>
          주문 확인
        </Button>
      </PositionBottom>
    </ContentContainer>
  );
}

const ContentContainer = styled(Flex.withComponent("section"))`
  width: 100%;
  padding-inline: 1.5rem;
  flex: 1;
  overflow: auto;
`;

const EmptyCartContainer = styled(Flex)`
  flex: 1;
`;
