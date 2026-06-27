import type { Meta, StoryObj } from '@storybook/react-vite';
import RemoteAreaSelect from './RemoteAreaSelect';

const meta: Meta<typeof RemoteAreaSelect> = {
  title: 'OrderCheck/RemoteAreaSelect',
  component: RemoteAreaSelect,
  argTypes: {
    onToggle: { action: 'toggled' },
  },
};

export default meta;
type Story = StoryObj<typeof RemoteAreaSelect>;

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
