import type { ElementType } from "react";

import { createClassName } from "@/core/utils/classname";

import { View } from "@/core/components/View";

import styles from "./Button.module.css";

import type { Props } from "./";

const classnameDefault = "ui-button";

export const Button = <T extends ElementType>(props: Props<T>) => {
  const {
    as = "button",
    className,
    children,

    variant,
    size,
    edge = "rounded",
    block,

    ...restProps
  } = props;

  const modifiers = {
    variant: variant && styles[`variant-${variant}`],
    size: size && styles[`size-${size}`],
    edge: edge && styles[`edge-${edge}`],
    block: block && styles[`is-block`],
  };

  const classname = createClassName({
    styles,
    baseName: classnameDefault,
    modifiers,
    className,
  });

  return (
    <View as={as} className={classname} {...restProps}>
      {children}
    </View>
  );
};
