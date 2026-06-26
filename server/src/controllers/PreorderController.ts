import type {Request, Response} from 'express';

import {preorderService} from '../services/PreorderService.js';
import type {CreatePreorderRequestBody, PreorderIdParams} from '../types/preorder.js';

export const preorderController = {
  getPreorder(req: Request<PreorderIdParams>, res: Response) {
    const preorderId = req.params.preorderId;

    const preorder = preorderService.getPreorder(preorderId);

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
