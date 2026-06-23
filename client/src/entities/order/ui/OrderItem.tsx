import Image from '../../../shared/ui/Image';
import Row from '../../../shared/layout/Row';
import Flex from '../../../shared/layout/Flex';
import Txt from '../../../shared/ui/Txt';
import type { OrderProduct } from '../types';

type OrderItemProps = {
  product: OrderProduct;
};

export default function OrderItem({ product }: OrderItemProps) {
  return (
    <li
      css={{
        padding: '20px 0',
        borderTop: '1px solid #eeeeee',
      }}
    >
      <Row
        left={
          <Image
            src={product.image ?? undefined}
            width={112}
            height={112}
            alt={product.name}
            styles={{ borderRadius: '8px' }}
          />
        }
        center={
          <Flex direction="column" gap={20} justify="center">
            <Flex direction="column" gap={4}>
              <Txt variant="label" color="black">
                {product.name}
              </Txt>

              <Txt variant="title" color="black">
                {product.price.toLocaleString()}원
              </Txt>
            </Flex>

            <Txt variant="label" color="black">
              {product.quantity}개
            </Txt>
          </Flex>
        }
      />
    </li>
  );
}
