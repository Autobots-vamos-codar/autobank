import express from 'express';
import TransactionController from '../controllers/TransactionsController.js';
import { bearer, local } from '../middleware/autenticationMiddleware.js';
import AccountController from '../controllers/AccountsController.js';

const router = express.Router();

router
  .post('/api/admin/transactions', bearer, TransactionController.createTransaction)
  .post('/api/accounts/login', local, AccountController.login)
  .get('/api/admin/transactions', bearer, TransactionController.findTransactions)
  .get('/api/admin/transactions/:id', bearer, TransactionController.findTransactionById)
  .put('/api/admin/transactions/:id', TransactionController.updateTransactionStatus);

export default router;
