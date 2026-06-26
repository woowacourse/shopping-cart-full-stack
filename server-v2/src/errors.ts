import type { FieldError } from './response.js';

export interface ErrorPayload {
    errorCode: string;
    errorMessage: string;
    data?: FieldError[];
}

export class AppError extends Error {
    constructor(public statusCode: number, public payload: ErrorPayload) {
        super(payload.errorMessage);
    }
}

export class BadRequestError extends AppError {
    constructor(payload: ErrorPayload) {
        super(400, payload);
        this.name = 'BadRequestError';
    }
}

export class NotFoundError extends AppError {
    constructor(payload: ErrorPayload) {
        super(404, payload);
        this.name = 'NotFoundError';
    }
}
