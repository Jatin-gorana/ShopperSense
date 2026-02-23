import { Hono } from 'hono';
import * as transactionController from '../controllers/transaction.controller.ts';

const router = new Hono();

router.get('/', transactionController.getTransactions);
router.post('/', transactionController.createTransaction);
router.post('/bulk', transactionController.bulkCreateTransactions);
router.get('/analytics/kpis', transactionController.getKPIs);
router.get('/analytics/segments', transactionController.getSegments);
router.get('/analytics/affinity', transactionController.getAffinity);
router.get('/analytics/trends', transactionController.getTrends);
router.get('/analytics/recommendations', transactionController.getRecommendations);
router.get('/analytics/ai-insights', transactionController.getAIInsights);

export default router;