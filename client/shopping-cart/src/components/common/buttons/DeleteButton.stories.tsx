import type { Meta, StoryObj } from '@storybook/react-vite';
import DeleteButton from './DeleteButton';

const meta: Meta<typeof DeleteButton> = {
  title: 'Common/DeleteButton',
  component: DeleteButton,
  argTypes: {
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof DeleteButton>;

export const Default: Story = {};
