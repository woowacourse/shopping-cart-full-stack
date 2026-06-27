import type { Meta, StoryObj } from '@storybook/react-vite';
import CheckboxLabel from './CheckboxLabel';

const meta: Meta<typeof CheckboxLabel> = {
  title: 'Common/CheckboxLabel',
  component: CheckboxLabel,
  argTypes: {
    onToggle: { action: 'toggled' },
  },
};

export default meta;
type Story = StoryObj<typeof CheckboxLabel>;

export const Unselected: Story = {
  args: {
    isSelected: false,
    label: '전체 선택',
  },
};

export const Selected: Story = {
  args: {
    isSelected: true,
    label: '전체 선택',
  },
};

export const Disabled: Story = {
  args: {
    isSelected: false,
    label: '전체 선택',
    disabled: true,
  },
};
