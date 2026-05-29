import type { Response } from 'express';

type ServerResponse<T> = SuccessResponse<T> | FailResponse<T>;

interface SuccessResponse<T> {
    data: T;
    status: number;
}

interface FailResponse<T> {
    status: number;
    errorCode: string;
    errorMessage: string;
    data?: T;
}

export const success = <T>(res: Response, data: T, status = 200) => {
    const response: SuccessResponse<T> = {
        status,
        data,
    };

    return res.status(status).json(response);
};

export const fail = <T>(res: Response, errorCode: string, errorMessage: string, status = 500, data?: T) => {
    const response: FailResponse<T> = {
        status,
        errorCode,
        errorMessage,
        ...(data ? { data } : {}),
    };

    return res.status(status).json(response);
};
