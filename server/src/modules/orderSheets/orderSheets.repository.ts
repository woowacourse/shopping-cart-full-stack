import { OrderSheet } from "./orderSheets.model.ts";
import { orderSheetStore } from "../../raw/raw.orderSheet.ts";

const getNextOrderSheetId = () =>
  Math.max(
    ...orderSheetStore.orderSheets.map((orderSheet) => orderSheet.id),
    0,
  ) + 1;

let nextOrderSheetId = getNextOrderSheetId();

export const findById = (orderSheetId: number) => {
  const orderSheet = orderSheetStore.orderSheets.find((orderSheet) => {
    return orderSheet.id === orderSheetId;
  });

  if (!orderSheet) return;

  return new OrderSheet({
    id: orderSheet.id,
    products: orderSheet.products,
    isRemoteShippingArea: orderSheet.remoteArea,
    selectedCoupons: orderSheet.coupons,
  });
};

export const create = (orderSheet: {
  products: {
    id: number;
    quantity: number;
  }[];
  remoteArea: boolean;
  coupons: number[];
}) => {
  const newOrderSheet = {
    ...orderSheet,
    id: nextOrderSheetId++,
  };

  orderSheetStore.orderSheets.push(newOrderSheet);

  return newOrderSheet;
};

export const updateIsRemoteShippingArea = (
  orderSheetId: number,
  isRemoteShippingArea: boolean,
) => {
  const orderSheet = orderSheetStore.orderSheets.find((orderSheet) => {
    return orderSheet.id === orderSheetId;
  });

  if (!orderSheet) return;

  orderSheet.remoteArea = isRemoteShippingArea;

  return orderSheet;
};

export const updateSelectedCoupons = (
  orderSheetId: number,
  selectedCoupons: number[],
) => {
  const orderSheet = orderSheetStore.orderSheets.find((orderSheet) => {
    return orderSheet.id === orderSheetId;
  });

  if (!orderSheet) return;

  orderSheet.coupons = selectedCoupons;

  return orderSheet;
};
