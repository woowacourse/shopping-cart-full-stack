import styled, { keyframes } from "styled-components";

export default function ShoppingCartSkeleton() {
  return (
    <Wrapper data-testid="card-list-skeleton">
      <NavSkeleton />
      <ContentArea>
        <TopSection>
          <TitleLine />
          <SubtitleLine />
        </TopSection>

        <CheckAllRow>
          <CheckboxSkeleton />
          <InfoLine width="48px" height="14px" />
        </CheckAllRow>

        <ItemList>
          {Array.from({ length: 3 }).map((_, i) => (
            <CartItemSkeleton key={i}>
              <ButtonRow>
                <CheckboxSkeleton />
                <DeleteSkeleton />
              </ButtonRow>
              <ItemRow>
                <ImageSkeleton />
                <InfoContainer>
                  <InfoLine width="160px" height="14px" />
                  <InfoLine width="100px" height="12px" />
                  <QuantitySkeleton />
                </InfoContainer>
              </ItemRow>
            </CartItemSkeleton>
          ))}
        </ItemList>

        <OrderSummary>
          <InfoLine width="100%" height="12px" />
          <PriceRow>
            <InfoLine width="60px" height="14px" />
            <InfoLine width="80px" height="14px" />
          </PriceRow>
          <PriceRow>
            <InfoLine width="40px" height="14px" />
            <InfoLine width="60px" height="14px" />
          </PriceRow>
          <Divider />
          <PriceRow>
            <InfoLine width="80px" height="16px" />
            <InfoLine width="100px" height="16px" />
          </PriceRow>
        </OrderSummary>

        <ButtonSkeleton />
      </ContentArea>
    </Wrapper>
  );
}

const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

const SkeletonBase = styled.div`
  background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
  background-size: 800px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 3px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 430px;
`;

const NavSkeleton = styled.div`
  width: 100%;
  height: 64px;
  background-color: #000000;
`;

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  width: 430px;
  gap: 20px;
`;

const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 382px;
  margin: 24px 36px;
`;

const TitleLine = styled(SkeletonBase)`
  width: 140px;
  height: 24px;
`;

const SubtitleLine = styled(SkeletonBase)`
  width: 200px;
  height: 12px;
`;

const CheckAllRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 382px;
`;

const CheckboxSkeleton = styled(SkeletonBase)`
  width: 16px;
  height: 16px;
  border-radius: 2px;
  flex-shrink: 0;
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 382px;
`;

const CartItemSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DeleteSkeleton = styled(SkeletonBase)`
  width: 32px;
  height: 20px;
`;

const ItemRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

const ImageSkeleton = styled(SkeletonBase)`
  width: 112px;
  height: 112px;
  flex-shrink: 0;
  border-radius: 4px;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-left: 24px;
`;

const InfoLine = styled(SkeletonBase)<{ width?: string; height?: string }>`
  width: ${({ width }) => width ?? "100%"};
  height: ${({ height }) => height ?? "12px"};
`;

const QuantitySkeleton = styled(SkeletonBase)`
  width: 72px;
  height: 24px;
`;

const OrderSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #e0e0e0;
`;

const ButtonSkeleton = styled(SkeletonBase)`
  width: 100%;
  height: 64px;
  border-radius: 0;
  margin-bottom: 24px;
`;
