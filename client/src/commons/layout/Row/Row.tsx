import { StyledRow } from "./Row.styles";

const Row = ({ gap, children }: { gap: number; children: React.ReactNode }) => {
  return <StyledRow gap={gap}>{children}</StyledRow>;
};

export default Row;
