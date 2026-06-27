import type { Meta, StoryObj } from '@storybook/react-vite';
import type { OrderCheckProduct } from '../../types';
import OrderCheckItemList from './OrderCheckItemList';

const products: OrderCheckProduct[] = [
  {
    id: '1',
    name: '데일리 라운드 티셔츠',
    price: 10000,
    imgUrl: 'https://picsum.photos/150?random=1',
    quantity: 2,
  },
  {
    id: '2',
    name: '와이드 데님 팬츠',
    price: 20000,
    imgUrl: 'https://picsum.photos/150?random=2',
    quantity: 1,
  },
];

const meta: Meta<typeof OrderCheckItemList> = {
  title: 'OrderCheck/OrderCheckItemList',
  component: OrderCheckItemList,
};

export default meta;
type Story = StoryObj<typeof OrderCheckItemList>;

export const Default: Story = {
  args: {
    products,
  },
};
