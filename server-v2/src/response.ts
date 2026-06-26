import type { Response } from 'express';

export interface SuccessResponse<T> {
    status: number;
    data: T;
}

export interface FieldError {
    type: string;
    errorCode: string;
}

export interface FailResponse<T> {
    status: number;
    errorCode: string;
    errorMessage: string;
    data?: T;
}

export const success = <T>(res: Response, data: T, status = 200) => {
    return res.status(status).json({ status, data });
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
