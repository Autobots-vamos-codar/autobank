import express from 'express';
import TransactionController from '../controllers/TransactionsController.js';

const router = express.Router();

router
  .post('/api/admin/transactions', TransactionController.createTransaction)
  .get('/api/admin/transactions', TransactionController.findTransactions)
  .get('/api/admin/transactions/:id', TransactionController.findTransactionById)
  .put('/api/admin/transactions/:id', TransactionController.updateTransactionStatus)
  .delete('/api/admin/accounts/:id', TransactionController.deleteAccount);

export default router;
