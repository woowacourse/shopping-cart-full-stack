import type { ElementType } from "react";

import { createClassName } from "@/core/utils/classname";

import { View } from "@/core/components/View";

import styles from "./Title.module.css";

import type { Props } from "./";

const classnameDefault = "ui-title";

export const Title = <T extends ElementType>(props: Props<T>) => {
  const {
    as = "div",
    className,
    title,
    subTitle,
    level = 1,
    ...restProps
  } = props;

  const modifiers = {
    level: level && styles[`level-${level}`],
  };

  const classname = createClassName({
    styles,
    baseName: classnameDefault,
    modifiers,
    className,
  });

  return (
    <View as={as} className={classname} {...restProps}>
      <div className={styles.title}>{title}</div>

      {subTitle && <div className={styles[`sub-title`]}>{subTitle}</div>}
    </View>
  );
};
