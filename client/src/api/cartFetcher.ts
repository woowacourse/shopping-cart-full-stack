import { CartAPiServerError } from './CartApiServerError';
import { fetcher } from './fetcher';

export interface FieldError {
    type: string;
    errorCode: string;
}

export interface ServerError {
    status: number;
    errorCode: string;
    errorMessage: string;
    data?: FieldError[];
}

const isServerError = (error: unknown): error is ServerError => {
    return error instanceof Object && 'errorCode' in error && 'errorMessage' in error;
};

export const cartFetcher = async <ExpectedSuccessType>(endpoint: string, options: RequestInit = {}) => {
    const defaultOptions = {
        method: 'GET',
        ...options,
        headers: {
            accept: 'application/json',
            ...(options.body ? { 'Content-Type': 'application/json' } : {}),
            ...options.headers,
        },
    };
    try {
        const response = await fetcher<ExpectedSuccessType, ServerError>(
            `${import.meta.env.VITE_API_BASE_URL}${endpoint}`,
            defaultOptions
        );
        return response;
    } catch (error) {
        if (isServerError(error)) throw new CartAPiServerError(error);
        throw error;
    }
};
