import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CartItem } from '../../types';
import CartItemList from './CartItemList';

const cartItems: CartItem[] = [
  {
    product: {
      id: '1',
      imgUrl: 'https://picsum.photos/150?random=1',
      name: '상품 이름',
      price: 10000,
    },
    quantity: 1,
    checkStatus: true,
  },
  {
    product: {
      id: '2',
      imgUrl: 'https://picsum.photos/150?random=2',
      name: '아주 긴 상품 이름이 들어왔을 때도 레이아웃이 유지되는지 확인하는 예시',
      price: 20000,
    },
    quantity: 3,
    checkStatus: false,
  },
];

const meta: Meta<typeof CartItemList> = {
  title: 'Cart/CartItemList',
  component: CartItemList,
  argTypes: {
    handleSelect: { action: 'select toggled' },
    onChangeQuantity: { action: 'quantity changed' },
    onDelete: { action: 'deleted' },
  },
};

export default meta;
type Story = StoryObj<typeof CartItemList>;

export const Default: Story = {
  args: {
    cartItems,
    handleSelect: () => {},
    onChangeQuantity: async () => {},
    onDelete: async () => {},
  },
};
