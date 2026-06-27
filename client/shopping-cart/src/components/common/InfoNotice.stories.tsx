import type { Meta, StoryObj } from '@storybook/react-vite';
import InfoNotice from './InfoNotice';

const meta: Meta<typeof InfoNotice> = {
  title: 'Common/InfoNotice',
  component: InfoNotice,
};

export default meta;
type Story = StoryObj<typeof InfoNotice>;

export const Default: Story = {
  args: {
    text: '총 주문 금액이 100,000원 이상일 경우 무료 배송됩니다.',
  },
};
