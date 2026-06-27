import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckIcon } from './CheckIcon';

const meta: Meta<typeof CheckIcon> = {
  title: 'Icons/CheckIcon',
  component: CheckIcon,
};

export default meta;
type Story = StoryObj<typeof CheckIcon>;

export const Inactive: Story = {
  args: {
    isActive: false,
  },
};

export const Active: Story = {
  args: {
    isActive: true,
  },
};
