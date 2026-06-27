import type { Meta, StoryObj } from '@storybook/react-vite';
import SectionHeader from './SectionHeader';

const meta: Meta<typeof SectionHeader> = {
  title: 'Common/SectionHeader',
  component: SectionHeader,
};

export default meta;
type Story = StoryObj<typeof SectionHeader>;

export const Default: Story = {
  args: {
    title: '장바구니',
    children: <p>현재 2 종류의 상품이 담겨있습니다.</p>,
  },
};
