import type { Meta, StoryObj } from "@storybook/react-vite";
import Loader from ".";
import Button from "../Button";

const meta = {
  title: "Components/Loader",
  component: Loader,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: { type: "range", min: 2, max: 20, step: 1 },
      description: "점 하나의 지름(px)",
    },
    color: {
      control: { type: "color" },
      description: "점 색상",
    },
  },
} satisfies Meta<typeof Loader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Large: Story = {
  args: { size: 12 },
};

export const Colored: Story = {
  args: { color: "#e84040" },
};

/** currentColor를 상속하므로, 어두운 배경 위 흰 글자 영역에서는 흰 점으로 보인다. */
export const OnDarkBackground: Story = {
  args: { color: "#fff" },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

/** 실제 사용 맥락: 버튼 내부에서 비동기 처리 중 표시. */
export const InsideButton: Story = {
  render: (args) => (
    <div style={{ width: 280, height: 44 }}>
      <Button radius="sm" disabled>
        <Loader {...args} />
      </Button>
    </div>
  ),
};
