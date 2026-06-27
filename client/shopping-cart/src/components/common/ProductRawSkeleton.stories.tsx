import type { Meta, StoryObj } from '@storybook/react-vite';
import ProductRawSkeleton from './ProductRawSkeleton';

const meta: Meta<typeof ProductRawSkeleton> = {
  title: 'Common/ProductRawSkeleton',
  component: ProductRawSkeleton,
};

export default meta;
type Story = StoryObj<typeof ProductRawSkeleton>;

export const Default: Story = {
  render: () => (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, width: 320 }}>
      <ProductRawSkeleton />
    </ul>
  ),
};

export const List: Story = {
  render: () => (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, width: 320 }}>
      {Array.from({ length: 3 }).map((_, i) => (
        <ProductRawSkeleton key={i} />
      ))}
    </ul>
  ),
};
