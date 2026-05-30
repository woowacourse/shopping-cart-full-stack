import type { ErrorRequestHandler, RequestHandler } from 'express';

import { fail } from '../common/response.ts';

interface RouteDefinition {
    path: string;
    methods: string[];
}

const routes: RouteDefinition[] = [
    {
        path: '/health',
        methods: ['GET'],
    },
    {
        path: '/products',
        methods: ['GET', 'POST'],
    },
    {
        path: '/products/:id',
        methods: ['DELETE'],
    },
    {
        path: '/carts/:cartId',
        methods: ['GET'],
    },
    {
        path: '/carts/:cartId/products/:productId',
        methods: ['PATCH', 'DELETE'],
    },
];

const toRoutePattern = (path: string) => {
    const pattern = path.replace(/:[^/]+/g, '[^/]+');

    return new RegExp(`^${pattern}$`);
};

const findRoute = (path: string) => {
    return routes.find((route) => toRoutePattern(route.path).test(path));
};

// header 기준으로 검증
export const validateJsonRequest: RequestHandler = (req, res, next) => {
    const hasBody = parseInt(req.headers['content-length'] ?? '0') > 0 || req.headers['transfer-encoding'] !== undefined;
    const shouldValidate = ['POST', 'PUT', 'PATCH'].includes(req.method);

    if (shouldValidate && hasBody && !req.is('application/json')) {
        return fail(res, 'NO_JSON', '요청 body가 JSON 형태가 아닙니다.', 400);
    }

    return next();
};

// 실제 값 유효성 검증
export const handleJsonParseError: ErrorRequestHandler = (error, _req, res, next) => {
    if (error instanceof SyntaxError && 'body' in error) {
        return fail(res, 'NO_JSON', '요청 body가 JSON 형태가 아닙니다.', 400);
    }

    return next(error);
};

export const handleMethodNotAllowed: RequestHandler = (req, res, next) => {
    const route = findRoute(req.path);

    if (route && !route.methods.includes(req.method)) {
        return fail(res, 'METHOD_NOT_ALLOWED', '요청 method에 해당하는 라우터가 없습니다.', 405);
    }

    return next();
};

export const handleRouteNotFound: RequestHandler = (_req, res) => {
    return fail(res, 'ROUTE_NOT_FOUND', '엔드포인트에 해당하는 라우터가 없습니다.', 404);
};
