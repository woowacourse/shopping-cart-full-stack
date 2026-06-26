import { css } from "@emotion/react";
import type { ReactNode } from "react";

const ListItem = ({
  prefix,
  title,
  subTitle,
  detail,
  suffix,
}: {
  prefix?: ReactNode;
  title?: ReactNode;
  subTitle?: ReactNode;
  detail?: ReactNode;
  suffix?: ReactNode;
}) => {
  return (
    <div
      css={css({
        display: "flex",
        gap: "8px",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px",
      })}
    >
      {prefix}
      <div
        css={css({
          flex: 1,
          display: "flex",
          flexDirection: "column",
        })}
      >
        {title && <div>{title}</div>}
        {subTitle && <div>{subTitle}</div>}
        {detail && (
          <div
            css={css({
              marginTop: "8px",
            })}
          >
            {detail}
          </div>
        )}
      </div>
      {suffix}
    </div>
  );
};

export default ListItem;
