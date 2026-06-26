import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Example/Button",
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    children: "button",
  },
};

export const VariantPrimary: Story = {
  args: {
    children: "button",
    variant: "primary",
  },
};

export const VariantSecondary: Story = {
  args: {
    children: "button",
    variant: "secondary",
  },
};

export const SizeSmall: Story = {
  args: {
    children: "button",
    size: "small",
  },
};

export const SizeMedium: Story = {
  args: {
    children: "button",
    size: "medium",
  },
};

export const SizeLarge: Story = {
  args: {
    children: "button",
    size: "large",
  },
};

export const EdgeRounded: Story = {
  args: {
    children: "button",
    variant: "primary",
    edge: "rounded",
  },
};

export const EdgeFlat: Story = {
  args: {
    children: "button",
    variant: "primary",
    edge: "flat",
  },
};

export const Block: Story = {
  args: {
    children: "button",
    variant: "primary",
    block: true,
  },
};
