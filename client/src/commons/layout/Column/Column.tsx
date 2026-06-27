import { StyledColumn } from "./Column.styles";

const Column = ({
  gap,
  children,
}: {
  gap: number;
  children: React.ReactNode;
}) => {
  return <StyledColumn gap={gap}>{children}</StyledColumn>;
};

export default Column;
