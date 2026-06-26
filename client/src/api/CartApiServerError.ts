import type { ServerError } from './cartFetcher';

export class CartAPiServerError extends Error {
    declare code: string;
    declare data: ServerError['data'];

    constructor({ errorCode, errorMessage, data }: ServerError) {
        super(errorMessage);
        this.code = errorCode;
        this.data = data;
    }
}
