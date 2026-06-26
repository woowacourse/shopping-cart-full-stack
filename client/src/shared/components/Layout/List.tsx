import { css } from "@emotion/react";
import type { ReactNode } from "react";

// 가로 행 아이템을 가지는 Flex Container
const List = ({ gap, children }: { gap: string; children: ReactNode }) => {
  return (
    <div
      css={css({
        display: "flex",
        flexDirection: "column",
        gap: gap,
      })}
    >
      {children}
    </div>
  );
};

export default List;
