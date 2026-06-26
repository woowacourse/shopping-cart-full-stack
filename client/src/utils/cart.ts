import type { CartItemType } from '../types/product.types';

export const isAllCartItemsSelected = (items: CartItemType[]) =>
  items.length > 0 && items.every((i) => i.isSelected);

export const getSelectedCartItemsCount = (items: CartItemType[]) =>
  items.filter((i) => i.isSelected).length;

export const isSelectedCartItemExist = (items: CartItemType[]) =>
  items.some((i) => i.isSelected);
