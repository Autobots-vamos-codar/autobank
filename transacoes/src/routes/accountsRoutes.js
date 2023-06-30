import express from 'express';
import TransactionController from '../controllers/TransactionsController.js';
import { bearer } from '../middleware/autenticationMiddleware.js';

const router = express.Router();

router
  .post('/api/admin/transactions', bearer, TransactionController.createTransaction)
  .get('/api/admin/transactions', bearer, TransactionController.findTransactions)
  .get('/api/admin/transactions/:id', bearer, TransactionController.findTransactionById)
  .put('/api/admin/transactions/:id', TransactionController.updateTransactionStatus);

export default router;
