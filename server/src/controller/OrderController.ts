import { Request, Response } from "express";
import {
  deleteOrderService,
  getOrdersService,
  postOrderService,
} from "../service/OrderService";
import { handleError } from "./ErrorHandler";

const getOrder = (request: Request, response: Response): void => {
  try {
    const order = getOrdersService(Number(request.params.orderId));
    response.status(200).json(order);
  } catch (error) {
    handleError(response, error);
  }
};

const postOrder = (request: Request, response: Response): void => {
  try {
    const newOrder = request.body;
    const addedOrder = postOrderService(newOrder);
    response.status(201).json(addedOrder);
  } catch (error) {
    handleError(response, error);
  }
};

const deleteOrder = (request: Request, response: Response): void => {
  try {
    const orderId = Number(request.params.orderId);
    deleteOrderService(orderId);
    response.status(204).send();
  } catch (error) {
    handleError(response, error);
  }
};

export default { getOrder, postOrder, deleteOrder };
