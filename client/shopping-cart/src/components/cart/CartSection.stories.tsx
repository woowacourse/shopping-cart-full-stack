import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CartItem } from '../../types';
import CartSection from './CartSection';

const cartItems: CartItem[] = [
  {
    product: {
      id: '1',
      imgUrl: 'https://picsum.photos/150?random=1',
      name: '데일리 라운드 티셔츠',
      price: 10000,
    },
    quantity: 2,
    checkStatus: true,
  },
  {
    product: {
      id: '2',
      imgUrl: 'https://picsum.photos/150?random=2',
      name: '와이드 데님 팬츠',
      price: 20000,
    },
    quantity: 1,
    checkStatus: false,
  },
];

const meta: Meta<typeof CartSection> = {
  title: 'Cart/CartSection',
  component: CartSection,
  argTypes: {
    onSelectAll: { action: 'select all toggled' },
    onSelect: { action: 'select toggled' },
    onChangeQuantity: { action: 'quantity changed' },
    onDelete: { action: 'deleted' },
  },
};

export default meta;
type Story = StoryObj<typeof CartSection>;

export const Default: Story = {
  args: {
    cartItems,
    isAllSelect: false,
    onSelectAll: () => {},
    onSelect: () => {},
    onChangeQuantity: async () => {},
    onDelete: async () => {},
  },
};
