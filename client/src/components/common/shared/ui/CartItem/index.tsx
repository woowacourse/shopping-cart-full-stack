import type { QuantityRange } from "@/types/cartProduct";
import minus from "@assets/minus.svg";
import plus from "@assets/plus.svg";
import ProductLayout from "@components/common/shared/layout/ProductLayout";
import styled from "@emotion/styled";
import { COLOR_PALETTE } from "@styles/colorPalette";

interface CartItemProps {
  name: string;
  image: string;
  price: number;
  quantity: number;
  quantityRange: QuantityRange;
  onChangeQuantity: (quantity: number) => void;
}

export default function CartItem({
  name,
  image,
  price,
  quantity,
  quantityRange,
  onChangeQuantity,
}: CartItemProps) {
  return (
    <ProductLayout
      imageContent={<CartItemImg src={image} alt={name} />}
      nameContent={<CartItemName>{name}</CartItemName>}
      priceContent={<CartItemPrice>{price.toLocaleString()}원</CartItemPrice>}
      content={
        <QuantityWrapper>
          <QuantityButton
            src={minus}
            disabled={quantity <= quantityRange.min}
            onClick={() =>
              onChangeQuantity(Math.max(quantityRange.min, quantity - 1))
            }
          />
          <Quantity>{quantity}</Quantity>
          <QuantityButton
            src={plus}
            disabled={quantity >= quantityRange.max}
            onClick={() =>
              onChangeQuantity(Math.min(quantityRange.max, quantity + 1))
            }
          />
        </QuantityWrapper>
      }
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

const QuantityWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const QuantityButton = styled.button<{ src: string }>`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid ${COLOR_PALETTE.border};
  background-color: ${COLOR_PALETTE.white};
  font-weight: 500;
  font-size: 1.25rem;
  line-height: 1rem;
  background-image: url("${(props) => props.src}");
  background-repeat: no-repeat;
  background-position: center;

  :active {
    background-color: ${COLOR_PALETTE.border};
  }

  :disabled {
    opacity: 0.2;
  }
`;

const Quantity = styled.span`
  font-weight: 500;
  font-size: 0.75rem;
  width: 1.5rem;
  text-align: center;
`;
