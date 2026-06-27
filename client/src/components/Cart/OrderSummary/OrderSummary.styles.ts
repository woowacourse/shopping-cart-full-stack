import styled from "@emotion/styled";

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding-bottom: 28px;
`;

export const FreeShippingNotice = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.45;

  p {
    margin: 0;
  }
`;

export const InfoIcon = styled.span`
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: 2px solid #000000;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 900;
  line-height: 1;
`;

export const PriceGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-top: 20px;
  border-top: 1px solid #e5e5e5;
`;

export const TotalSection = styled.div`
  padding-top: 26px;
  border-top: 1px solid #e5e5e5;
`;
