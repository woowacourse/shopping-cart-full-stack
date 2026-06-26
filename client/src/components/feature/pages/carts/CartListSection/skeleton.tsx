import Spacing from "@components/common/shared/layout/Spacing";
import Divider from "@components/common/shared/ui/Divider";
import Skeleton from "@components/common/shared/ui/Skeleton";
import styled from "@emotion/styled";

interface CartListSectionSkeletonProps {
  count?: number;
}

export default function CartListSectionSkeleton({
  count = 3,
}: CartListSectionSkeletonProps) {
  return (
    <CartListContainer data-testid="cart-list-skeleton">
      <SelectAllWrapper>
        <Skeleton width="1.5rem" height="1.5rem" borderRadius="0.5rem" />
        <Skeleton width="4rem" height="0.9375rem" />
      </SelectAllWrapper>
      <Spacing size={1.25} />
      <CartListWrapper>
        {Array.from({ length: count }).map((_, index) => (
          <CartItemContainer key={index}>
            <Divider />
            <Spacing size={0.75} />
            <ActionButtonWrapper>
              <Skeleton width="1.5rem" height="1.5rem" borderRadius="0.5rem" />
              <Skeleton
                width="2.75rem"
                height="1.5rem"
                borderRadius="0.25rem"
              />
            </ActionButtonWrapper>
            <Spacing size={0.75} />
            <CartItemInfoContainer>
              <Skeleton width="7rem" height="7rem" borderRadius="0.5rem" />
              <CartItemInfoWrapper>
                <ProductInfoWrapper>
                  <Skeleton width="60%" height="0.9375rem" />
                  <Skeleton width="40%" height="1.5rem" />
                </ProductInfoWrapper>
                <QuantityWrapper>
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
                </QuantityWrapper>
              </CartItemInfoWrapper>
            </CartItemInfoContainer>
          </CartItemContainer>
        ))}
      </CartListWrapper>
    </CartListContainer>
  );
}

const CartListContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const SelectAllWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const CartListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const CartItemContainer = styled.div``;

const ActionButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CartItemInfoContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
`;

const CartItemInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1;
`;

const ProductInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const QuantityWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;
