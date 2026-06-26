import styled from '@emotion/styled';

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
`;

export const ContainerWrapper = styled.div`
  width: 100%;
  max-width: 430px;
  background-color: #ffffff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
  padding-bottom: 104px;
`;

export const MainContent = styled.main`
  display: flex;
  flex-direction: column;
  padding: 36px 24px 0 24px;
  flex: 1;
`;

export const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 36px;
`;

export const PageTitle = styled.p`
  font-size: 24px;
  font-weight: 700;
  color: #000000;
  margin: 0;
`;

export const SubTitle = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: #0a0d13;
  margin: 0;
  line-height: 1.5;
`;

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #0000001a;
  margin: 24px 0;
`;

export const SectionDivider = styled(Divider)`
  margin: 0 0 24px 0;
`;

export const ProductItemWrapper = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
`;

export const ProductThumbnail = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  background-color: #f5f5f5;
`;

export const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
`;

export const ProductName = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: #0a0d13;
  display: flex;
  align-items: center;
`;

export const ProductPrice = styled.p`
  font-size: 18px;
  font-weight: 700;
  color: #000000;
  margin-top: 4px;
  display: flex;
  align-items: baseline;
  gap: 6px;
`;

export const ProductQuantity = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: #0a0d13;
  margin-top: 8px;
`;

export const CouponApplyButton = styled.button`
  width: 100%;
  height: 48px;
  background-color: #ffffff;
  border: 1px solid #0000001a;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  color: #0a0d13;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  &:active {
    background-color: #f9f9f9;
  }
`;

export const DeliverySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const SectionTitle = styled.p`
  font-size: 16px;
  font-weight: 700;
  color: #0a0d13;
  margin-bottom: 16px;
`;

export const DeliveryCheckboxRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

export const DeliveryLabel = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: #0a0d13;
`;

export const InfoText = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: #0a0d13;
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const IconImage = styled.img`
  width: 16px;
  height: 16px;
`;

export const SummarySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;

export const PriceRow = styled.div<{ isTotal?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const PriceLabel = styled.p<{ isTotal?: boolean }>`
  font-size: 16px;
  font-weight: 700;
  color: #0a0d13;
`;

export const PriceValue = styled.p<{ isTotal?: boolean }>`
  font-size: ${({ isTotal }) => (isTotal ? '24px' : '18px')};
  font-weight: 700;
  color: #000000;
`;

export const BottomSection = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 430px;
`;

export const PayButton = styled.button`
  width: 100%;
  height: 64px;
  background-color: #000000;
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
  border: none;
  cursor: pointer;

  &:disabled {
    background-color: #bebebe;
    cursor: not-allowed;
  }
`;

export const GiftSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 24px;
`;

export const GiftSectionTitle = styled(SectionTitle)`
  margin-bottom: 0;
`;

export const GiftBadge = styled.span`
  background-color: #000000;
  color: #ffffff;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  margin-right: 6px;
`;

export const OriginalPriceStrike = styled.del`
  font-size: 12px;
  color: #999999;
  font-weight: 500;
`;
