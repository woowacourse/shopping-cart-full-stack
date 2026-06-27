import type { Meta, StoryObj } from '@storybook/react-vite';
import PrimaryButton from './PrimaryButton';

const meta: Meta<typeof PrimaryButton> = {
  title: 'Buttons/PrimaryButton',
  component: PrimaryButton,
  argTypes: {
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof PrimaryButton>;

export const Default: Story = {
  args: {
    text: '주문 확인',
  },
};

export const Disabled: Story = {
  args: {
    text: '주문 확인',
    isDisabled: true,
  },
};
