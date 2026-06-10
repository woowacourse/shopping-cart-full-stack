import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {CartItemRow} from './CartItemRow.js';
import type {CartItem} from '../../domain/types.js';

const cartItem: CartItem = {
  id: 'cart-1',
  productInfo: {id: 'product-hoodie', name: '후드 집업', price: 10000, imageUrl: '/hoodie.png'},
  quantity: 2,
};

const defaultProps = {
  cartItem,
  checked: true,
  onChangeQuantity: jest.fn(),
  onDelete: jest.fn(),
  onToggle: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('CartItemRow', () => {
  test('장바구니 상품 정보를 보여준다', () => {
    render(<CartItemRow {...defaultProps} />);

    expect(screen.getByText('후드 집업')).toBeInTheDocument();
    expect(screen.getByText('10,000원')).toBeInTheDocument();
    expect(screen.getByRole('img', {name: '후드 집업'})).toHaveAttribute('src', '/hoodie.png');
  });

  test('선택 체크박스를 누르면 장바구니 항목 선택 변경을 요청한다', async () => {
    const user = userEvent.setup();
    const onToggle = jest.fn();

    render(<CartItemRow {...defaultProps} onToggle={onToggle} />);

    await user.click(screen.getByLabelText('선택'));

    expect(onToggle).toHaveBeenCalledWith('cart-1');
  });

  test('수량 변경 버튼을 누르면 장바구니 항목 id와 변경할 수량을 전달한다', async () => {
    const user = userEvent.setup();
    const onChangeQuantity = jest.fn();

    render(<CartItemRow {...defaultProps} onChangeQuantity={onChangeQuantity} />);

    await user.click(screen.getByRole('button', {name: '숫자 증가'}));
    await user.click(screen.getByRole('button', {name: '숫자 감소'}));

    expect(onChangeQuantity).toHaveBeenNthCalledWith(1, 'cart-1', 3);
    expect(onChangeQuantity).toHaveBeenNthCalledWith(2, 'cart-1', 1);
  });

  test('삭제 버튼을 누르면 장바구니 항목 삭제를 요청한다', async () => {
    const user = userEvent.setup();
    const onDelete = jest.fn();

    render(<CartItemRow {...defaultProps} onDelete={onDelete} />);

    await user.click(screen.getByRole('button', {name: '삭제'}));

    expect(onDelete).toHaveBeenCalledWith('cart-1');
  });
});
