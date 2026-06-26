import styled from "@emotion/styled";
import Info from "../images/info.svg?react";

interface Props {
  children: React.ReactNode;
}

export default function InfoText({ children }: Props) {
  return (
    <Paragraph>
      <Info aria-label="정보" />
      {children}
    </Paragraph>
  );
}

const Paragraph = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 12px;
  margin: 2px 0;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
`;
