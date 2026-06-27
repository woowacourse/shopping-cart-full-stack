import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CouponInfo } from '../../types';
import CouponSection from './CouponSection';

const info: CouponInfo = {
  coupons: [
    {
      couponId: 'FIXED5000',
      couponTitle: '5,000원 할인 쿠폰',
      disabled: false,
      description: [
        { type: 'MIN_ORDER_AMOUNT', content: { minAmount: 100000 } },
        { type: 'EXPIRY_DATE', content: { expiresAt: '2026-11-30' } },
      ],
    },
    {
      couponId: 'BOGO',
      couponTitle: '2+1 쿠폰',
      disabled: true,
      description: [
        { type: 'MIN_QUANTITY_PER_PRODUCT', content: { minQuantity: 2 } },
        { type: 'EXPIRY_DATE', content: { expiresAt: '2026-06-30' } },
      ],
    },
    {
      couponId: 'FREESHIPPING',
      couponTitle: '무료 배송 쿠폰',
      disabled: false,
      description: [
        { type: 'MIN_ORDER_AMOUNT', content: { minAmount: 50000 } },
        { type: 'EXPIRY_DATE', content: { expiresAt: '2026-08-31' } },
      ],
    },
  ],
  selectedCoupons: ['FREESHIPPING'],
};

const meta: Meta<typeof CouponSection> = {
  title: 'OrderCheck/CouponSection',
  component: CouponSection,
  argTypes: {
    onLoadCoupons: { action: 'loaded' },
    onToggle: { action: 'toggled' },
    onApply: { action: 'applied' },
  },
};

export default meta;
type Story = StoryObj<typeof CouponSection>;

export const Default: Story = {
  args: {
    info,
    selectedIds: info.selectedCoupons,
    discountAmount: 3000,
    onApply: async () => true,
  },
};
