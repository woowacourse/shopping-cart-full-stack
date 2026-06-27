import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckIcon } from '../../icons/CheckIcon';
import IconButton from './IconButton';

const meta: Meta<typeof IconButton> = {
  title: 'Common/IconButton',
  component: IconButton,
  argTypes: {
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Inactive: Story = {
  args: {
    isActive: false,
    children: <CheckIcon isActive={false} />,
  },
};

export const Active: Story = {
  args: {
    isActive: true,
    children: <CheckIcon isActive={true} />,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: <CheckIcon isActive={false} />,
  },
};
