import type { ComponentProps } from "react";
import { Flex } from "./Flex";

export function Stack(props: Omit<ComponentProps<typeof Flex>, "direction">) {
  return <Flex direction="column" {...props} />;
}
