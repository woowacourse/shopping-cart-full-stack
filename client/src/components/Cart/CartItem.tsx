import type { CartItem } from "../../type/types";
interface Props {
  cartItem: CartItem;
  onDelete: (cartItemId: number) => void;
}

export default function CartItem({ cartItem, onDelete }: Props) {
  return (
    <div>
      <Container>
        <ButtonRaw>
          <input type="checkbox" />
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
