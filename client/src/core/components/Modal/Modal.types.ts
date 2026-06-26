import type { ElementType, ReactNode } from "react";

import type { PolymorphicProps } from "@/core/components/View";

export type AS = "div";

export type OwnProps = {
  children: ReactNode;
  onClose: () => void;
};

export type Props<T extends ElementType = AS> = PolymorphicProps<T, OwnProps>;

export type HeaderOwnProps = {
  children: ReactNode;
};

export type HeaderProps<T extends ElementType = AS> = PolymorphicProps<
  T,
  HeaderOwnProps
>;
