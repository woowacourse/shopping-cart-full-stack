import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {CartItemList} from './CartItemList.js';
import type {CartItem} from '../../domain/types.js';

const cartItems: CartItem[] = [
  {
    id: 'cart-1',
    productInfo: {id: 'product-hoodie', name: '후드 집업', price: 10000, imageUrl: '/hoodie.png'},
    quantity: 2,
  },
  {
    id: 'cart-2',
    productInfo: {id: 'product-denim', name: '데님 팬츠', price: 30000, imageUrl: '/denim-pants.png'},
    quantity: 1,
  },
];

const defaultProps = {
  items: cartItems,
  selectedIds: ['cart-1'],
  onChangeQuantity: jest.fn(),
  onChangeSelectedIds: jest.fn(),
  onDelete: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

describe('CartItemList', () => {
  test('전체 선택 체크박스를 누르면 모든 장바구니 항목 id를 전달한다', async () => {
    const user = userEvent.setup();
    const onChangeSelectedIds = jest.fn();

    render(<CartItemList {...defaultProps} onChangeSelectedIds={onChangeSelectedIds} />);

    await user.click(screen.getByLabelText('전체 선택'));

    expect(onChangeSelectedIds).toHaveBeenCalledWith(['cart-1', 'cart-2']);
  });

  test('전체 선택된 상태에서 전체 선택 체크박스를 누르면 빈 선택 id 목록을 전달한다', async () => {
    const user = userEvent.setup();
    const onChangeSelectedIds = jest.fn();

    render(
      <CartItemList {...defaultProps} selectedIds={['cart-1', 'cart-2']} onChangeSelectedIds={onChangeSelectedIds} />
    );

    await user.click(screen.getByLabelText('전체 선택'));

    expect(onChangeSelectedIds).toHaveBeenCalledWith([]);
  });

  test('선택된 장바구니 항목 체크박스를 누르면 해당 id를 제외한 선택 id 목록을 전달한다', async () => {
    const user = userEvent.setup();
    const onChangeSelectedIds = jest.fn();

    render(<CartItemList {...defaultProps} onChangeSelectedIds={onChangeSelectedIds} />);

    await user.click(screen.getAllByRole('checkbox')[1]);

    expect(onChangeSelectedIds).toHaveBeenCalledWith([]);
  });

  test('선택되지 않은 장바구니 항목 체크박스를 누르면 해당 id를 더한 선택 id 목록을 전달한다', async () => {
    const user = userEvent.setup();
    const onChangeSelectedIds = jest.fn();

    render(<CartItemList {...defaultProps} onChangeSelectedIds={onChangeSelectedIds} />);

    await user.click(screen.getAllByRole('checkbox')[2]);

    expect(onChangeSelectedIds).toHaveBeenCalledWith(['cart-1', 'cart-2']);
  });

  test('삭제를 확인하면 장바구니 항목 삭제를 요청한다', async () => {
    const user = userEvent.setup();
    const onDelete = jest.fn();

    jest.spyOn(window, 'confirm').mockReturnValue(true);

    render(<CartItemList {...defaultProps} onDelete={onDelete} />);

    await user.click(screen.getAllByRole('button', {name: '삭제'})[0]);

    expect(window.confirm).toHaveBeenCalledWith('상품을 삭제하시겠습니까?');
    expect(onDelete).toHaveBeenCalledWith('cart-1');
  });

  test('삭제를 취소하면 장바구니 항목 삭제를 요청하지 않는다', async () => {
    const user = userEvent.setup();
    const onDelete = jest.fn();

    jest.spyOn(window, 'confirm').mockReturnValue(false);

    render(<CartItemList {...defaultProps} onDelete={onDelete} />);

    await user.click(screen.getAllByRole('button', {name: '삭제'})[0]);

    expect(window.confirm).toHaveBeenCalledWith('상품을 삭제하시겠습니까?');
    expect(onDelete).not.toHaveBeenCalled();
  });
});
