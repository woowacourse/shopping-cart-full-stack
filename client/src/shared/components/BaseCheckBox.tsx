import { css } from "@emotion/react";

// TODO: 라벨 넣을지 말지 생각해보자
const BaseCheckBox = ({
  isSelected,
  disabled,
  onSelect,
}: {
  isSelected: boolean;
  disabled: boolean;
  onSelect: (nextSelect: boolean) => void;
}) => {
  return (
    <input
      type="checkbox"
      checked={isSelected}
      disabled={disabled}
      onChange={(e) => onSelect(e.target.checked)}
      css={css({
        width: "20px",
        height: "20px",
        padding: "4px",
        accentColor: "black",
      })}
    ></input>
  );
};

export default BaseCheckBox;
