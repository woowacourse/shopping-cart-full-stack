import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {CouponModal} from './CouponModal.js';
import type {Coupon, CouponId} from '../../../coupon/domain/types.js';

const coupons: Coupon[] = [
  {
    couponId: 1,
    code: 'FIXED5000',
    name: '5,000원 할인 쿠폰',
    expirationDate: '2026-11-30T14:59:59.000Z',
    condition: {
      description: '최소 주문 금액: 100,000원',
    },
    disabled: true,
    disabledReason: '최소 주문 금액을 만족해야 합니다.',
  },
];

describe('CouponModal', () => {
  test('선택된 쿠폰은 비활성 상태가 되어도 해제할 수 있다', async () => {
    const user = userEvent.setup();
    const onChangeSelectedCouponIds = jest.fn();

    render(
      <CouponModal
        coupons={coupons}
        discountAmount={5000}
        errorActionText='다시 시도'
        errorMessage=''
        selectedCouponIds={[1]}
        status='success'
        onApply={jest.fn()}
        onChangeSelectedCouponIds={onChangeSelectedCouponIds}
        onClose={jest.fn()}
        onRetry={jest.fn()}
      />
    );

    await user.click(screen.getByRole('checkbox', {name: '5,000원 할인 쿠폰'}));

    expect(onChangeSelectedCouponIds).toHaveBeenCalledWith([] satisfies CouponId[]);
  });
});
