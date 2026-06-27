import type { Meta, StoryObj } from '@storybook/react-vite';
import AsyncContent from './AsyncContent';

const meta: Meta<typeof AsyncContent> = {
  title: 'Common/AsyncContent',
  component: AsyncContent,
};

export default meta;
type Story = StoryObj<typeof AsyncContent>;

const loadingFallback = <p>로딩 중...</p>;
const errorFallback = <p>불러오는 데 실패했습니다.</p>;

export const Loading: Story = {
  args: {
    isLoading: true,
    isError: false,
    loadingFallback,
    errorFallback,
    children: <p>실제 콘텐츠</p>,
  },
};

export const Error: Story = {
  args: {
    isLoading: false,
    isError: true,
    loadingFallback,
    errorFallback,
    children: <p>실제 콘텐츠</p>,
  },
};

export const Content: Story = {
  args: {
    isLoading: false,
    isError: false,
    loadingFallback,
    errorFallback,
    children: <p>실제 콘텐츠</p>,
  },
};
