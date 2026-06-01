import type { NextFunction, Request, Response } from 'express';

type Handler = (req: Request, res: Response, next: NextFunction) => void;

export const wrap = (fn: Handler) => (req: Request, res: Response, next: NextFunction) => {
    try {
        Promise.resolve(fn(req, res, next)).catch(next);
    } catch (error) {
        next(error);
    }
};
