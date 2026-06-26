import { Router } from "express";
import PreorderController from "../controller/PreorderController";

export const createPreorderRouter = (
  preorderController: PreorderController,
): Router => {
  const preorderRouter = Router();

  preorderRouter.post("/", preorderController.postPreorder);
  preorderRouter.get("/:preorderId", preorderController.getPreorder);

  return preorderRouter;
};
