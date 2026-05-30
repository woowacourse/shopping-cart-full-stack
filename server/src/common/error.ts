export class ServiceError<T> extends Error {
    errorCode: string;
    errorMessage: string;
    data?: T;

    constructor(errorCode: string, errorMessage: string, data?: T) {
        super(errorMessage);
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
        this.data = data;
    }
}

export const getStatusCode = (error: ServiceError<unknown>): number => {
    if (error.errorCode === 'RESOURCE_NOT_FOUND') return 404;

    return 400;
};
