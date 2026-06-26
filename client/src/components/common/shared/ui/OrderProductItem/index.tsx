import { COLOR_PALETTE } from "@/styles/colorPalette";
import ProductLayout from "@components/common/shared/layout/ProductLayout";
import styled from "@emotion/styled";

interface OrderProductItemProps {
  name: string;
  image: string;
  price: number;
  quantity: number;
}

function OrderProductItem({
  name,
  image,
  price,
  quantity,
}: OrderProductItemProps) {
  return (
    <ProductLayout
      imageContent={<CartItemImg src={image} alt={name} />}
      nameContent={<CartItemName>{name}</CartItemName>}
      priceContent={<CartItemPrice>{price.toLocaleString()}원</CartItemPrice>}
      content={<Quantity>{quantity}개</Quantity>}
    />
  );
}

const CartItemImg = styled.img`
  width: 7rem;
  aspect-ratio: 1/1;
  border-radius: 0.5rem;
  border: none;
  background-color: ${COLOR_PALETTE["image-placeholder"]};
`;

const CartItemName = styled.p`
  font-weight: 500;
  font-size: 0.75rem;
  line-height: 0.9375rem;
`;

const CartItemPrice = styled.p`
  font-weight: 700;
  font-size: 1.5rem;
  line-height: 100%;
`;

const Quantity = styled.span`
  font-weight: 500;
  font-size: 0.75rem;
  width: 1.5rem;
  text-align: center;
`;

export default OrderProductItem;
