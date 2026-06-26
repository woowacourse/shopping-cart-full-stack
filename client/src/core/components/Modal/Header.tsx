import type { ElementType } from "react";

import { View } from "@/core/components/View";

import styles from "./Modal.module.css";

import type { HeaderProps } from "./";

export const Header = <T extends ElementType>(props: HeaderProps<T>) => {
  const { as = "div", children, ...restProps } = props;

  return (
    <View as={as} className={styles["header"]} {...restProps}>
      {children}
    </View>
  );
};
