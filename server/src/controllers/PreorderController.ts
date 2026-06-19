import type {Request, Response} from 'express';
import type {CreatePreorderRequestBody, PreorderIdParams} from '../types/preorder.js';
import {preorderService} from '../services/PreorderService.js';

export const preorderController = {
  getPreorder(req: Request<PreorderIdParams>, res: Response) {
    const preorder = preorderService.getPreorder(req.params.preorderId);

    res.status(200).json({
      body: preorder,
    });
  },

  createPreorder(req: Request<{}, unknown, CreatePreorderRequestBody>, res: Response) {
    const preorderId = preorderService.createPreorder(req.body);

    res.status(201).json({
      body: {
        preorderId,
      },
    });
  },
};
