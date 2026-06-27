import type { Meta, StoryObj } from '@storybook/react-vite';
import CouponApplyButton from './CouponApplyButton';

const meta: Meta<typeof CouponApplyButton> = {
  title: 'Common/CouponApplyButton',
  component: CouponApplyButton,
  argTypes: {
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof CouponApplyButton>;

export const Default: Story = {};
