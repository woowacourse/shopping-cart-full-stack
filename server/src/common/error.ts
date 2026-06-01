export type ServiceErrorCode = 'RESOURCE_NOT_FOUND' | 'MISSING_FIELD' | 'TYPE_MISMATCH' | 'INVALID';

export class ServiceError<T> extends Error {
    errorCode: ServiceErrorCode;
    errorMessage: string;
    data?: T;

    constructor(errorCode: ServiceErrorCode, errorMessage: string, data?: T) {
        super(errorMessage);
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
        this.data = data;
    }
}

export const getStatusCode = (error: ServiceError<unknown>): number => {
    switch (error.errorCode) {
        case 'RESOURCE_NOT_FOUND':
            return 404;
        case 'MISSING_FIELD':
        case 'TYPE_MISMATCH':
        case 'INVALID':
            return 400;
        default: {
            const _exhaustive: never = error.errorCode;
            throw new Error(`처리되지 않은 에러 코드: ${error.errorCode}`);
        }
    }
};
