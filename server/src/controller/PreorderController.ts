import { Request, Response } from "express";
import PreorderService from "../service/PreorderService";
import { handleError } from "./ErrorHandler";

export default class PreorderController {
  #preorderService: PreorderService;

  constructor(preorderService: PreorderService) {
    this.#preorderService = preorderService;
  }

  #runPostPreorder = (request: Request, response: Response): void => {
    const { selectedCartIds } = request.body;
    const numericIds = selectedCartIds.map(Number);
    const preorder = this.#preorderService.createPreorder(numericIds);
    response.status(201).json(preorder);
  };

  #runGetPreorder = (
    request: Request<{ preorderId: string }>,
    response: Response,
  ): void => {
    const { preorderId } = request.params;
    const preorder = this.#preorderService.getPreorder(preorderId);
    response.status(200).json(preorder);
  };

  postPreorder = (request: Request, response: Response): void => {
    try {
      this.#runPostPreorder(request, response);
    } catch (error) {
      handleError(response, error);
    }
  };

  getPreorder = (
    request: Request<{ preorderId: string }>,
    response: Response,
  ): void => {
    try {
      this.#runGetPreorder(request, response);
    } catch (error) {
      handleError(response, error);
    }
  };
}
