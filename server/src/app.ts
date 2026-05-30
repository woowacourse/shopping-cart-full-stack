import express from 'express';
import cors from 'cors';

import {
    handleJsonParseError,
    handleMethodNotAllowed,
    handleRouteNotFound,
    handleServiceError,
    validateJsonRequest,
} from './middleware/error.middleware.ts';
import router from './router/index.ts';

const app = express();

app.use(cors());

app.use(validateJsonRequest);
app.use(express.json());
app.use(handleJsonParseError);

app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});

app.use(router);
app.use(handleServiceError);
app.use(handleMethodNotAllowed);
app.use(handleRouteNotFound);

export default app;
