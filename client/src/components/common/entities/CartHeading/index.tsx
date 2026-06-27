import Flex from "@components/common/shared/Flex";
import Text from "@components/common/shared/Text";
import styled from "@emotion/styled";

interface CartHeadingProps {
  productCount: number;
}

export default function CartHeading({ productCount }: CartHeadingProps) {
  return (
    <Flex direction="column" gap={12}>
      <Text typograph="heading1" as="h2">
        장바구니
      </Text>
      <Description visible={productCount > 0}>
        <Text typograph="caption" as="p">
          현재 {productCount}종류의 상품이 담겨있습니다.
        </Text>
      </Description>
    </Flex>
  );
}


const Description = styled.div<{ visible: boolean }>`
  visibility: ${(props) => (props.visible ? "visible" : "hidden")};
`;
