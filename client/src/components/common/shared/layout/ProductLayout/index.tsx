import styled from "@emotion/styled";

interface ProductLayoutProps {
  imageContent: React.ReactNode;
  nameContent: React.ReactNode;
  priceContent: React.ReactNode;
  content: React.ReactNode;
}

function ProductLayout({
  imageContent,
  nameContent,
  priceContent,
  content,
}: ProductLayoutProps) {
  return (
    <ProductItemInfoContainer>
      {imageContent}
      <ProductItemInfoWrapper>
        <ProductInfoWrapper>
          {nameContent}
          {priceContent}
        </ProductInfoWrapper>
        <ContentWrapper>{content}</ContentWrapper>
      </ProductItemInfoWrapper>
    </ProductItemInfoContainer>
  );
}

const ProductItemInfoContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
`;

const ProductItemInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ProductInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

export default ProductLayout;
