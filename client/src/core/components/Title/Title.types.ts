import type { ElementType, ReactNode } from "react";

import type { PolymorphicProps } from "@/core/components/View";

export type AS = "div";

export type OwnProps = {
  title: ReactNode;
  subTitle?: ReactNode;
  level?: 1 | 2;
};

export type Props<T extends ElementType = AS> = PolymorphicProps<T, OwnProps>;
