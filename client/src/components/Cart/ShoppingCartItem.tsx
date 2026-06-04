import styled from "styled-components";
import type { CartItem } from "../../type/types";
interface Props {
  cartItem: CartItem;
  selectedItems: Map<number, boolean>;
  onDelete: (cartItemId: number) => void;
  onTogle: (cartItemId: number) => void;
}

export default function ShoppingCartItem({
  cartItem,
  onDelete,
  onTogle,
  selectedItems,
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
          />
        </ButtonRaw>
        <ItemContainer>
          <img src={cartItem.productData.thumbnailUrl} />
          <ItemInfoContainer>
            <p>{cartItem.productData.name}</p>
            <p>{cartItem.productData.price}원</p>
            <QuantityChangeButton />
          </ItemInfoContainer>
        </ItemContainer>
      </Container>
    </div>
  );
}

const Container = styled.div``;
const ButtonRaw = styled.div``;
const ItemContainer = styled.div``;
const ItemInfoContainer = styled.div``;
const QuantityChangeButton = styled.div``;
