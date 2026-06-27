import type { Meta, StoryObj } from '@storybook/react-vite';
import QuantityControl from './QuantityControl';

const meta: Meta<typeof QuantityControl> = {
  title: 'Cart/QuantityControl',
  component: QuantityControl,
  argTypes: {
    onIncrease: { action: 'increased' },
    onDecrease: { action: 'decreased' },
  },
};

export default meta;
type Story = StoryObj<typeof QuantityControl>;

export const Default: Story = {
  args: {
    quantity: 1,
  },
};
