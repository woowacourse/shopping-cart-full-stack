import Divider from "@components/common/shared/Divider";
import Flex from "@components/common/shared/Flex";
import Skeleton from "@components/common/shared/Skeleton";
import Spacing from "@components/common/shared/Spacing";
import styled from "@emotion/styled";

interface CartListSkeletonProps {
  count?: number;
}

export default function CartListSkeleton({ count = 3 }: CartListSkeletonProps) {
  return (
    <Flex direction="column" data-testid="cart-list-skeleton">
      <Flex gap={8} align="center">
        <Skeleton width="1.25rem" height="1.25rem" borderRadius="0.25rem" />
        <Skeleton width="4rem" height="0.9375rem" />
      </Flex>
      <Spacing size={1.25} />
      <Flex direction="column" gap={20}>
        {Array.from({ length: count }).map((_, index) => (
          <CartItemSkeleton key={index}>
            <Divider />
            <Spacing size={0.75} />
            <Flex justify="space-between" align="center">
              <Skeleton
                width="1.25rem"
                height="1.25rem"
                borderRadius="0.25rem"
              />
              <Skeleton
                width="2.75rem"
                height="1.5rem"
                borderRadius="0.25rem"
              />
            </Flex>
            <Spacing size={0.75} />
            <Flex gap={24} align="center">
              <Skeleton width="7rem" height="7rem" borderRadius="0.5rem" />
              <CartItemInfoWrapper direction="column" gap={24}>
                <Flex direction="column" gap={4}>
                  <Skeleton width="60%" height="0.9375rem" />
                  <Skeleton width="40%" height="1.5rem" />
                </Flex>
                <Flex gap={8} align="center">
                  <Skeleton
                    width="1.5rem"
                    height="1.5rem"
                    borderRadius="0.5rem"
                  />
                  <Skeleton width="1.5rem" height="0.9375rem" />
                  <Skeleton
                    width="1.5rem"
                    height="1.5rem"
                    borderRadius="0.5rem"
                  />
                </Flex>
              </CartItemInfoWrapper>
            </Flex>
          </CartItemSkeleton>
        ))}
      </Flex>
    </Flex>
  );
}

const CartItemSkeleton = styled.div``;

const CartItemInfoWrapper = styled(Flex)`
  flex: 1;
`;
