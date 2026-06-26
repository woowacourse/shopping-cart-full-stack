import { Request, Response } from "express";
import OrderService from "../service/OrderService";
import { handleError } from "./ErrorHandler";

export default class OrderController {
  #orderService: OrderService;

  constructor(orderService: OrderService) {
    this.#orderService = orderService;
  }

  #runGetOrder = (request: Request, response: Response): void => {
    const orderId = Number(request.params.orderId);
    const order = this.#orderService.getOrder(orderId);
    response.status(200).json(order);
  };

  #runPostOrder = (request: Request, response: Response): void => {
    const payload = request.body;
    const savedOrder = this.#orderService.createOrder(payload);
    response.status(201).json(savedOrder);
  };

  getOrder = (request: Request, response: Response): void => {
    try {
      this.#runGetOrder(request, response);
    } catch (error) {
      handleError(response, error);
    }
  };

  postOrder = (request: Request, response: Response): void => {
    try {
      this.#runPostOrder(request, response);
    } catch (error) {
      handleError(response, error);
    }
  };
}
