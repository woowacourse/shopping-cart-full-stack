import express from "express";
import { postPayment } from "./payments.controller";

export const paymentsRouter = express.Router();

paymentsRouter.post("/", postPayment);
