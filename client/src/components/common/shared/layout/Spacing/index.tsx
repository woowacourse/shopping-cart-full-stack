import styled from "@emotion/styled";

const Spacing = styled.div<{
  size: number;
  direction?: "horizontal" | "vertical";
  unit?: "rem" | "px";
}>`
  width: ${(props) =>
    props.direction === "horizontal"
      ? props.size + (props.unit || "rem")
      : "auto"};
  height: ${(props) =>
    !props.direction || props.direction === "vertical"
      ? props.size + (props.unit || "rem")
      : "auto"};
`;

export default Spacing;
