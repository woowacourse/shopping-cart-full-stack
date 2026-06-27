import ProductImg from "@components/common/entities/ProductImg";
import Flex from "@components/common/shared/Flex";
import Text from "@components/common/shared/Text";
import { COLOR_PALETTE } from "@styles/colorPalette.ts";

interface OrderItemProps {
  name: string;
  imgUrl: string;
  price: number;
  quantity: number;
  hasGift: boolean;
}

export default function OrderItem({ name, imgUrl, price, quantity, hasGift }: OrderItemProps) {
  return (
    <Flex gap={24} align="center">
      <ProductImg src={imgUrl} alt={name} />
      <Flex direction="column" gap={24}>
        <Flex direction="column" gap={4}>
          <Text typograph="caption" as="p">
            {name}
          </Text>
          <Text typograph="heading1" as="p">
            {price.toLocaleString()}원
          </Text>
        </Flex>
        <Flex gap={8} align="center">
          <Text typograph="caption" as="span">
            {quantity}개
          </Text>
          {hasGift && (
            <Text typograph="caption" as="span" color={COLOR_PALETTE.blue}>
              + 1
            </Text>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}
