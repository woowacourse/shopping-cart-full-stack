import styled from "@emotion/styled";

export const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  width: calc(100% - 48px);
  background-color: #ffffff;
  border-radius: 16px;
  padding: 32px 24px 24px 24px;
  display: flex;
  flex-direction: column;
  max-height: 85vh;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const ModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #000000;
  margin: 0;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  color: #000000;
  cursor: pointer;
`;

export const ModalInfoText = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: #0a0d13;
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 0 0 24px 0;
`;

export const IconImage = styled.img`
  width: 16px;
  height: 16px;
`;

export const CouponListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  margin-bottom: 24px;
  flex: 1;
`;

export const CouponItemWrapper = styled.div<{ disabled?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid #0000001a;
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
  cursor: pointer;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

export const CouponInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const CouponName = styled.p`
  font-size: 14px;
  font-weight: 700;
  color: #000000;
  margin: 0;
`;

export const CouponDetail = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: #0a0d13;
  margin: 0;
`;

export const ModalApplyButton = styled.button`
  width: 100%;
  height: 56px;
  background-color: #333333;
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:disabled {
    background-color: #bebebe;
  }
`;
