import type { Meta, StoryObj } from '@storybook/react-vite';
import AppHeader from './AppHeader';

const meta: Meta<typeof AppHeader> = {
  title: 'Layout/AppHeader',
  component: AppHeader,
};

export default meta;
type Story = StoryObj<typeof AppHeader>;

export const Default: Story = {
  args: {
    children: (
      <h1 style={{ font: 'var(--text-logo)', color: 'var(--color-white)' }}>SHOP</h1>
    ),
  },
};
