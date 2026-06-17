import type {Request, Response} from 'express';
import {CreatePreorderRequestBody} from '../type.js';
import {preorderService} from '../services/PreorderService.js';

export const preorderController = {
  createPreorder(req: Request<{}, unknown, CreatePreorderRequestBody>, res: Response) {
    const preorderId = preorderService.createPreorder(req.body);

    res.status(201).json({
      body: {
        preorderId,
      },
    });
  },
};
