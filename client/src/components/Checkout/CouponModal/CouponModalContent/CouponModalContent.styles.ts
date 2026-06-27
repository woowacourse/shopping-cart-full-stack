import styled from "@emotion/styled";

export const CouponInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;

  img {
    width: 16px;
    height: 16px;
  }

  p {
    margin: 0;
    color: #333333;
    font-size: 12px;
    font-weight: 500;
    line-height: 1.6;
  }
`;

export const CouponItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 0;
  border-top: 1px solid #f1f1f1;

  &:last-of-type {
    border-bottom: none;
  }

  p {
    margin: 0;
    color: #444444;
    line-height: 1.5;
  }
`;

export const CouponItemTitle = styled.p`
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #111111;
`;

export const CouponDescription = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  height: 34px;
  p {
    margin: 0;
    color: #666666;
    font-size: 12px;
    line-height: 15px;
  }
`;

export const CompleteButton = styled.button`
  width: 100%;
  margin-top: 32px;
  padding: 11px 18px;
  border: none;
  border-radius: 5px;
  background-color: #333333;
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  outline: none;
  box-shadow: none;

  &:focus-visible {
    outline: none;
    box-shadow: none;
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;
