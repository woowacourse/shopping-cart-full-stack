import styled from "@emotion/styled";
import { COLOR_PALETTE } from "@styles/colorPalette";
import checkedIcon from "@assets/checked.svg";
import checkIcon from "@assets/check.svg";

export default function CheckBox(props: React.ComponentProps<"input">) {
  return <CheckBoxInput type="checkbox" {...props} />;
}

const CheckBoxInput = styled.input`
  width: 24px;
  height: 24px;
  border-radius: 8px;
  border: 1px solid ${COLOR_PALETTE.border};
  background-image: url("${checkIcon}");
  background-repeat: no-repeat;
  background-position: center;
  appearance: none;
  cursor: pointer;

  :checked {
    background-color: ${COLOR_PALETTE.black};
    background-image: url("${checkedIcon}");
    background-repeat: no-repeat;
    background-position: center;
  }
`;
