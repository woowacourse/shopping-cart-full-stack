import { Request, Response } from "express";
import { resetDemoData } from "../services/reset.service.js";

export async function resetDemoDatabase(_request: Request, response: Response): Promise<void> {
  await resetDemoData();
  response.status(204).end();
}
