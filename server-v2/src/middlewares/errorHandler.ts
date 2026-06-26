import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors.js';
import { fail } from '../response.js';

const isJsonParseError = (err: unknown): boolean => {
    return err instanceof SyntaxError && (err as { type?: string }).type === 'entity.parse.failed';
};

const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (isJsonParseError(err)) {
        fail(res, 'NO_JSON', '요청 body는 JSON 형식이어야 합니다.', 400);
        return;
    }

    if (err instanceof AppError) {
        fail(res, err.payload.errorCode, err.payload.errorMessage, err.statusCode, err.payload.data);
        return;
    }

    fail(res, 'INTERNAL_SERVER_ERROR', '서버 에러가 발생했습니다.', 500);
};

export default errorHandler;
