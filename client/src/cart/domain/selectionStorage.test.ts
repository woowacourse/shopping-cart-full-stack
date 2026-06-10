import {loadSelectedCartItemIds, saveSelectedCartItemIds} from './selectionStorage.js';

const STORAGE_KEY = 'shopping-cart-selected-cart-item-ids';

describe('selectionStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('저장된 선택 id가 없으면 null을 반환한다', () => {
    expect(loadSelectedCartItemIds()).toBeNull();
  });

  test('선택 id 배열을 저장하고 불러온다', () => {
    saveSelectedCartItemIds(['cart-1', 'cart-2']);

    expect(loadSelectedCartItemIds()).toEqual(['cart-1', 'cart-2']);
  });

  test('빈 선택 id 배열을 저장하고 불러온다', () => {
    saveSelectedCartItemIds([]);

    expect(loadSelectedCartItemIds()).toEqual([]);
  });

  test('깨진 JSON이면 null을 반환한다', () => {
    localStorage.setItem(STORAGE_KEY, '{');

    expect(loadSelectedCartItemIds()).toBeNull();
  });

  test('배열이 아니면 null을 반환한다', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({selectedIds: ['cart-1']}));

    expect(loadSelectedCartItemIds()).toBeNull();
  });

  test('문자열 배열이 아니면 null을 반환한다', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['cart-1', 2]));

    expect(loadSelectedCartItemIds()).toBeNull();
  });
});
