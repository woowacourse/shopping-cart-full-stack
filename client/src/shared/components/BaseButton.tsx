import { css } from "@emotion/react";
import type { ComponentPropsWithRef } from "react";

type BaseButtonProps = ComponentPropsWithRef<"button"> & {
  display: "full" | "inline";
  style: "black" | "white" | "gray";
  rounded: "none" | "md";
};

const buttonStyle = {
  black: {
    backgroundColor: "black",
    color: "white",
    border: "none",
  },
  white: {
    backgroundColor: "white",
    color: "#333333BF",
    border: "1px solid #333333BF",
  },
  gray: {
    backgroundColor: "#333333",
    color: "white",
    border: "none",
  },
};

const BaseButton = ({
  children,
  type = "button",
  disabled = false,
  display = "inline",
  style = "black",
  rounded = "md",
  onClick,
}: BaseButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      css={css({
        display: display,
        width: display === "full" ? "100%" : undefined,
        borderRadius: rounded === "md" ? "8px" : undefined,
        height: "64px",
        fontWeight: "700",
        fontSize: "16px",
        cursor: "pointer",

        "&:disabled": {
          backgroundColor: "#bebebe",
          opacity: 1,
          cursor: "not-allowed",
        },
        ...buttonStyle[style as keyof typeof buttonStyle],
      })}
    >
      {children}
    </button>
  );
};

export default BaseButton;
