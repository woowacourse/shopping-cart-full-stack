import styled from "@emotion/styled";

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 24px;
  width: 100%;
  height: 100%;
`;

export const Image = styled.img`
  width: 112px;
  height: 112px;
  flex-shrink: 0;
  border-radius: 4px;
  object-fit: cover;
  background: #f5f5f5;
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 10px 0;
  width: 100%;
`;

export const Title = styled.p`
  margin: 0;
  font-size: 12px;
  font-weight: 500;
  color: #0a0d13;
  line-height: 15px;
`;

export const Quantity = styled.div`
  margin: 0;
  padding-top: 24px;
  font-size: 14px;
  font-weight: 500;
  color: #666666;
  line-height: 1.5;
`;
