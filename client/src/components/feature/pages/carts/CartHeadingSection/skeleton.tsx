import Skeleton from "@components/common/shared/ui/Skeleton";
import styled from "@emotion/styled";

export default function CartHeadingSectionSkeleton() {
  return (
    <CartHeadingSkeletonContainer>
      <Skeleton width="6rem" height="1.5rem" />
      <Skeleton width="12rem" height="0.9375rem" />
    </CartHeadingSkeletonContainer>
  );
}

const CartHeadingSkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;
