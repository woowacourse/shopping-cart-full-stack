import CheckBox from '../../../shared/ui/CheckBox';
import Image from '../../../shared/ui/Image';
import Txt from '../../../shared/ui/Txt';
import { DeleteButton, QuantityButton } from '../../../shared/ui/Button';
import Row from '../../../shared/layout/Row';
import Flex from '../../../shared/layout/Flex';
import type { CartItem } from '../types';

type CartItemCardProps = {
  cartItem: CartItem;
  onIncrease: (id: string) => Promise<void>;
  onDecrease: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onToggleItem: (id: string, checked: boolean) => void;
};

export default function CartItemCard({
  cartItem,
  onIncrease,
  onDecrease,
  onDelete,
  onToggleItem,
}: CartItemCardProps) {
  return (
    <li
      css={{
        padding: '20px 0',
        borderTop: '1px solid #eeeeee',
      }}
    >
      <Row
        left={
          <Flex direction="column" gap={12}>
            <CheckBox
              checked={cartItem.isSelected}
              onChange={(checked) => onToggleItem(cartItem.product.id, checked)}
            />
            <Image
              src={cartItem.product.image ?? undefined}
              width={112}
              height={112}
              alt="상품 이미지"
              styles={{ borderRadius: '8px' }}
            />
          </Flex>
        }
        center={
          <Flex
            direction="column"
            gap={20}
            justify="center"
            styles={{ paddingTop: '36px' }}
          >
            <Flex direction="column" gap={4}>
              <Txt variant="label" color="black">
                {cartItem.product.name}
              </Txt>

              <Txt variant="title" color="black">
                {cartItem.product.price.toLocaleString()}원
              </Txt>
            </Flex>

            <Flex direction="row" gap={12} align="center">
              <QuantityButton onClick={() => onDecrease(cartItem.product.id)}>
                -
              </QuantityButton>
              <Txt variant="label" color="black">
                {cartItem.quantity}
              </Txt>
              <QuantityButton onClick={() => onIncrease(cartItem.product.id)}>
                +
              </QuantityButton>
            </Flex>
          </Flex>
        }
        right={
          <DeleteButton onClick={() => onDelete(cartItem.product.id)}>
            삭제
          </DeleteButton>
        }
      />
    </li>
  );
}
