import { InvalidError, NotFoundError } from "../errors/CustomErrorClass";
import { ERROR_MESSAGE } from "../errors/ErrorMessage";
import { StoredOrder } from "../repositories/StoredOrder";
import { storedOrderRepository } from "../repositories/StoredOrderRepository";

export const getOrdersService = (orderId: number): StoredOrder => {
  const order = storedOrderRepository.findById(orderId);
  if (!order)
    throw new NotFoundError("NOT_FOUND_ORDER", ERROR_MESSAGE.NOT_FOUND_ORDER);
  return order;
};

export const postOrderService = (
  newOrder: Omit<StoredOrder, "orderId">,
): StoredOrder => {
  const addedOrder = storedOrderRepository.addOrder(newOrder);
  return addedOrder;
};

export const updateRemoteAreaService = (
  orderId: number,
  remoteArea: boolean,
) => {
  const order = storedOrderRepository.findById(orderId);
  if (!order)
    throw new NotFoundError("NOT_FOUND_ERROR", ERROR_MESSAGE.NOT_FOUND_ORDER);
  storedOrderRepository.updateRemoteArea(orderId, remoteArea);
};

export const deleteOrderService = (orderId: number): void => {
  if (!orderId)
    throw new InvalidError("INVALID_ORDER_ID", ERROR_MESSAGE.INVALID_ORDER_ID);

  const order = storedOrderRepository.findById(orderId);
  if (!order)
    throw new NotFoundError("NOT_FOUND_ORDER", ERROR_MESSAGE.NOT_FOUND_ORDER);

  storedOrderRepository.deleteById(orderId);
};
