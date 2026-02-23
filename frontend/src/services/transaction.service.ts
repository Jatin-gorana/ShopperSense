import api from '../lib/api';
import { 
    MOCK_TRANSACTIONS, 
    MOCK_KPIS, 
    MOCK_SEGMENTS, 
    MOCK_AFFINITY, 
    MOCK_TRENDS, 
    MOCK_AI_INSIGHTS 
} from '../data/mockData';

const useMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export interface Transaction {
    id?: string;
    customer_id: string;
    age: number;
    gender: string;
    location: string;
    product_category: string;
    product_name: string;
    purchase_amount: number;
    quantity: number;
    purchase_date: string;
    payment_method: string;
    metadata?: any;
}

export const transactionService = {
    getTransactions: async (params?: any, signal?: AbortSignal) => {
        if (useMock) return MOCK_TRANSACTIONS;
        const response = await api.get('/transactions', { params, signal });
        return response.data;
    },
    createTransaction: async (data: Transaction, signal?: AbortSignal) => {
        if (useMock) return { ...data, id: Math.random().toString() };
        const response = await api.post('/transactions', data, { signal });
        return response.data;
    },
    bulkCreateTransactions: async (data: Transaction[], signal?: AbortSignal) => {
        if (useMock) return { success: true, count: data.length };
        const response = await api.post('/transactions/bulk', { transactions: data }, { signal });
        return response.data;
    },
    getKPIs: async (params?: any, signal?: AbortSignal) => {
        if (useMock) return MOCK_KPIS;
        const response = await api.get('/transactions/analytics/kpis', { params, signal });
        return response.data;
    },
    getSegments: async (params?: any, signal?: AbortSignal) => {
        if (useMock) return MOCK_SEGMENTS;
        const response = await api.get('/transactions/analytics/segments', { params, signal });
        return response.data;
    },
    getAffinity: async (params?: any, signal?: AbortSignal) => {
        if (useMock) return MOCK_AFFINITY;
        const response = await api.get('/transactions/analytics/affinity', { params, signal });
        return response.data;
    },
    getTrends: async (params?: any, signal?: AbortSignal) => {
        if (useMock) return MOCK_TRENDS;
        const response = await api.get('/transactions/analytics/trends', { params, signal });
        return response.data;
    },
    getRecommendations: async (params?: any, signal?: AbortSignal) => {
        if (useMock) return { crossSell: [], upsell: [], segment: [] };
        const response = await api.get('/transactions/analytics/recommendations', { params, signal });
        return response.data;
    },
    getAIInsights: async (params?: any, signal?: AbortSignal) => {
        if (useMock) return MOCK_AI_INSIGHTS;
        const response = await api.get('/transactions/analytics/ai-insights', { params, signal });
        return response.data;
    }
};

