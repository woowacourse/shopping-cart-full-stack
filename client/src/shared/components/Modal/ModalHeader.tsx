import type { ReactNode } from "react";
import { useModalContext } from "./ModalContext";
import styled from "@emotion/styled";
import { colors } from "../../styles/tokens";
import { Row } from "../layout";

export function ModalHeader({ children }: { children: ReactNode }) {
  const { onClose } = useModalContext();
  return (
    <Row as="header" justify="space-between" align="center">
      <Title>{children}</Title>
      <CloseButton type="button" onClick={onClose} aria-label="닫기">
        ✕
      </CloseButton>
    </Row>
  );
}

const Title = styled.h2`
  font-family: "Noto Sans KR", sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0;
`;
const CloseButton = styled.button`
  width: 24px;
  height: 24px;
  background: none;
  border: none;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  color: ${colors.textPrimary};
`;
