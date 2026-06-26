import { css } from "@emotion/react";
import type { ReactNode } from "react";

interface SummaryProps {
  children: ReactNode;
}

function Summary({ children }: SummaryProps) {
  return <div>{children}</div>;
}

function Message({ children }: { children: ReactNode }) {
  return (
    <p className="typo-sm-r" css={messageStyle}>
      {children}
    </p>
  );
}

function Breakdown({ children }: { children: ReactNode }) {
  return <div css={breakdownStyle}>{children}</div>;
}

function Result({ children, "data-testid": testId }: { children: ReactNode; "data-testid"?: string }) {
  return (
    <div css={resultStyle} data-testid={testId}>
      {children}
    </div>
  );
}

interface SummaryItemProps {
  label: ReactNode;
  value: ReactNode;
}

function Item({ label, value }: SummaryItemProps) {
  return (
    <div css={rowStyle}>
      <span className="typo-md-b">{label}</span>
      <span className="typo-xl-b">{value}</span>
    </div>
  );
}

Summary.Message = Message;
Summary.Breakdown = Breakdown;
Summary.Result = Result;
Summary.Item = Item;

export default Summary;

const messageStyle = css`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 0;
`;

const breakdownStyle = css`
  padding: 12px 0;
  border-top: 1px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const resultStyle = css`
  padding: 8px 0;
`;

const rowStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
`;
