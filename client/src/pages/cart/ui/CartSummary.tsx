import info from '../../../assets/Info-outline.svg';
import Image from '../../../shared/ui/Image';
import Txt from '../../../shared/ui/Txt';
import Flex from '../../../shared/layout/Flex';
import Row from '../../../shared/layout/Row';

type CartSummaryProps = {
  orderAmount: number;
  deliveryFee: number;
  totalAmount: number;
};

export default function CartSummary({
  orderAmount,
  deliveryFee,
  totalAmount,
}: CartSummaryProps) {
  return (
    <Flex as="section" direction="column" gap={12} styles={{ width: '100%' }}>
      <Flex as="span" gap={4} align="center">
        <Image src={info} alt="" ariaHidden width={16} height={16} />
        <Txt variant="label" color="text">
          총 주문 금액이 100,000원 이상일 경우 무료 배송됩니다.
        </Txt>
      </Flex>

      <Flex direction="column" gap={20} styles={{ width: '100%' }}>
        <div
          css={{
            width: '100%',
            height: '1px',
            backgroundColor: '#eeeeee',
          }}
        />
        <Row
          left={
            <Txt variant="button" color="text">
              주문 금액
            </Txt>
          }
          right={
            <Txt variant="title" color="black">
              {orderAmount.toLocaleString()}원
            </Txt>
          }
        />

        <Row
          left={
            <Txt variant="button" color="text">
              배송비
            </Txt>
          }
          right={
            <Txt variant="title" color="black">
              {deliveryFee.toLocaleString()}원
            </Txt>
          }
        />
        <div
          css={{
            width: '100%',
            height: '1px',
            backgroundColor: '#eeeeee',
          }}
        />

        <Row
          left={
            <Txt variant="button" color="text">
              총 결제 금액
            </Txt>
          }
          right={
            <Txt variant="title" color="black">
              {totalAmount.toLocaleString()}원
            </Txt>
          }
        />
      </Flex>
    </Flex>
  );
}
