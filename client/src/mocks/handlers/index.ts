import { cartHandlers } from './cartHandlers';
import { couponHandlers } from './couponHandlers';
import { orderSheetHandlers } from './orderSheetHandlers';

export const handlers = [
  ...cartHandlers,
  ...couponHandlers,
  ...orderSheetHandlers,
];
