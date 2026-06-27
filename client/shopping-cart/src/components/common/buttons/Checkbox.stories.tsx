import type { Meta, StoryObj } from '@storybook/react-vite';
import Checkbox from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Common/Checkbox',
  component: Checkbox,
  argTypes: {
    onToggle: { action: 'toggled' },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Unselected: Story = {
  args: {
    isSelected: false,
  },
};

export const Selected: Story = {
  args: {
    isSelected: true,
  },
};

export const Disabled: Story = {
  args: {
    isSelected: false,
    disabled: true,
  },
};
