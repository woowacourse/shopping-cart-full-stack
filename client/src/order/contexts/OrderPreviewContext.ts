import {createContext} from 'react';

import type {OrderPreviewPageState} from '../hooks/useOrderPreviewPageState.js';

export const OrderPreviewContext = createContext<OrderPreviewPageState | null>(null);
