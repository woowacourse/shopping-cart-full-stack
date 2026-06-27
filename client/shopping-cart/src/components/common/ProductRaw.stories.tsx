import type { Meta, StoryObj } from '@storybook/react-vite';
import ProductRaw from './ProductRaw';

const meta: Meta<typeof ProductRaw> = {
  title: 'Common/ProductRaw',
  component: ProductRaw,
};

export default meta;
type Story = StoryObj<typeof ProductRaw>;

export const Default: Story = {
  args: {
    image: 'https://picsum.photos/150',
    name: '상품 이름',
    price: 10000,
    children: (
      <div
        style={{
          border: '1px dashed #ccc',
          padding: '8px 12px',
          color: '#999',
          fontSize: '12px',
        }}
      >
        children slot
      </div>
    ),
  },
};
