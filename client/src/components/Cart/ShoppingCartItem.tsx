import styled from "styled-components";
import type { CartItem } from "../../type/types";
import QuantityControl from "./QuantityControl";
interface Props {
  cartItem: CartItem;
  selectedItems: Map<number, boolean>;
  onDelete: (cartItemId: number) => void;
  onTogle: (cartItemId: number) => void;
  onQuantityChange: (cartItemId: number, quantity: number) => void;
}

export default function ShoppingCartItem({
  cartItem,
  onDelete,
  onTogle,
  selectedItems,
  onQuantityChange,
}: Props) {
  return (
    <div>
      <Container>
        <ButtonRaw>
          <input
            type="checkbox"
            onChange={() => {
              onTogle(cartItem.cartItemId);
            }}
            checked={selectedItems.get(cartItem.cartItemId) ?? false}
          />
          <button
            onClick={() => {
              onDelete(cartItem.cartItemId);
            }}
          >
            삭제
          </button>
        </ButtonRaw>
        <ItemContainer>
          <img
            width={112}
            height={112}
            src={cartItem.productData.thumbnailUrl}
          />
          <ItemInfoContainer>
            <Name>{cartItem.productData.name}</Name>
            <Price>{cartItem.productData.price.toLocaleString()}원</Price>
            <QuantityControl
              cartItemId={cartItem.cartItemId}
              quantity={cartItem.quantity}
              onQuantityChange={onQuantityChange}
            />
          </ItemInfoContainer>
        </ItemContainer>
      </Container>
    </div>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 384px;
`;
const ButtonRaw = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;
const ItemInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 24px;
`;

const Name = styled.p``;

const Price = styled.p``;
