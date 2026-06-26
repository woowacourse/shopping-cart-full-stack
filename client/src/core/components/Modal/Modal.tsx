import type { ElementType } from "react";

import { createClassName } from "@/core/utils/classname";

import { View } from "@/core/components/View";

import styles from "./Modal.module.css";

import { Header } from "./Header";

import type { Props } from "./";

const classnameDefault = "ui-modal";

export const Modal = <T extends ElementType>(props: Props<T>) => {
  const { as = "div", className, children, onClose, ...restProps } = props;

  const modifiers = {};

  const classname = createClassName({
    styles,
    baseName: classnameDefault,
    modifiers,
    className,
  });

  return (
    <View as={as} className={classname} {...restProps}>
      <div className={styles["container"]}>
        <button className={styles["button-close"]} onClick={onClose}>
          close
        </button>
        {children}
      </div>
      <button className={styles["dim"]}></button>
    </View>
  );
};

Modal.Header = Header;
