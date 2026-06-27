import CartItem from "@components/common/entities/CartItem";
import CheckBox from "@components/common/shared/CheckBox";
import Divider from "@components/common/shared/Divider";
import Flex from "@components/common/shared/Flex";
import Text from "@components/common/shared/Text";
import type { Cart, Product, QuantityRange } from "@/types/cartProduct";
import Spacing from "@components/common/shared/Spacing";
import styled from "@emotion/styled";
import { COLOR_PALETTE } from "@styles/colorPalette.ts";

interface CartListProps {
  cartProducts: Cart[];
  checkedItems: Product["id"][];
  onSelectAll: () => void;
  onSelect: (id: Product["id"]) => void;
  quantityRange: QuantityRange;
  onChangeQuantity: (id: Product["id"], quantity: number) => void;
  onDelete: (id: Product["id"]) => void;
}

export default function CartList({
  cartProducts,
  checkedItems,
  onDelete,
  quantityRange,
  onChangeQuantity,
  onSelect,
  onSelectAll,
}: CartListProps) {
  return (
    <Flex direction="column">
      <Flex as="label" gap={8} align="center">
        <CheckBox checked={checkedItems.length === cartProducts.length} onChange={() => onSelectAll()} />
        <Text typograph="caption">전체선택</Text>
      </Flex>
      <Spacing size={1.25} />
      <Flex as="ul" direction="column" gap={20}>
        {cartProducts.map(({ product, quantity }) => (
          <CartItemWrapper>
            <Flex justify="space-between" align="center">
              <CheckBox checked={checkedItems.includes(product.id)} onSelect={() => onSelect(product.id)} />
              <DeleteButton onClick={() => onDelete(product.id)}>삭제</DeleteButton>
            </Flex>
            <Spacing size={0.75} />
            <Divider />
            <Spacing size={0.75} />
            <CartItem
              key={product.id}
              {...product}
              quantity={quantity}
              quantityRange={quantityRange}
              onChangeQuantity={(newQuantity) => onChangeQuantity(product.id, newQuantity)}
            />
          </CartItemWrapper>
        ))}
      </Flex>
      <Spacing size={3.25} />
    </Flex>
  );
}

const CartItemWrapper = styled.li``;

const DeleteButton = styled.button`
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid ${COLOR_PALETTE.border};
  background-color: ${COLOR_PALETTE.white};
  font-weight: 500;
  font-size: 0.75rem;
  line-height: 0.9375rem;

  :active {
    background-color: ${COLOR_PALETTE.border};
  }
`;
