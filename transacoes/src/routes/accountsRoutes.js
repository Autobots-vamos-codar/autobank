import express from 'express';
import TransactionController from '../controllers/TransactionsController.js';

const router = express.Router();

router
  .get('/api/admin/transactions', TransactionController.findTransactions)
  .get('/api/admin/transactions/:id', TransactionController.findTransactionById)
  .post('/api/admin/accounts', TransactionController.createAccount)
  .put('/api/admin/transactions/:id', TransactionController.updateTransactionStatus)
  .delete('/api/admin/accounts/:id', TransactionController.deleteAccount);

export default router;
