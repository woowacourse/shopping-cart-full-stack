import type { ReactNode } from 'react';
import Txt from '../../../shared/ui/Txt';
import Flex from '../../../shared/layout/Flex';

type CartSectionProps = {
  cartItemsCount: number;
  children: ReactNode;
};

export default function CartSection({
  cartItemsCount,
  children,
}: CartSectionProps) {
  // 상품이 없는 경우
  if (cartItemsCount === 0) {
    return (
      <Txt
        variant="info"
        color="text"
        styles={{ textAlign: 'center', margin: 'auto 0' }}
      >
        장바구니에 담은 상품이 없습니다.
      </Txt>
    );
  }

  return (
    <Flex
      as="section"
      direction="column"
      gap={36}
      styles={{
        height: '75vh',
        overflowY: 'scroll',
        width: '100%',
        padding: '0 24px',
      }}
    >
      <Flex direction="column" gap={12}>
        <Txt variant="title" color="black">
          장바구니
        </Txt>
        <Txt variant="label" color="text">
          현재 {cartItemsCount}종류의 상품이 담겨있습니다.
        </Txt>
      </Flex>
      {children}
    </Flex>
  );
}
