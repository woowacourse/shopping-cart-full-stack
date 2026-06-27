import type { Meta, StoryObj } from '@storybook/react-vite';
import OrderSummary from './OrderSummary';

const meta: Meta<typeof OrderSummary> = {
  title: 'Common/OrderSummary',
  component: OrderSummary,
};

export default meta;
type Story = StoryObj<typeof OrderSummary>;

export const WithoutDiscount: Story = {
  args: {
    data: {
      orderPrice: 40000,
      deliveryFee: 3000,
      totalOrderAmount: 43000,
    },
  },
};

export const WithDiscount: Story = {
  args: {
    data: {
      orderPrice: 40000,
      deliveryFee: 3000,
      couponDiscountAmount: 5000,
      totalOrderAmount: 38000,
    },
  },
};

export const FreeShipping: Story = {
  args: {
    data: {
      orderPrice: 120000,
      deliveryFee: 0,
      totalOrderAmount: 120000,
    },
  },
};
