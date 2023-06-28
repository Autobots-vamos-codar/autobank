import express from 'express';
import AccountController from '../controllers/AccountsController.js';

const router = express.Router();

router
  .get('/api/admin/transactions', AccountController.findTransactions)
  .get('/api/admin/transactions/:id', AccountController.findTransactionById)
  .post('/api/admin/accounts', AccountController.createAccount)
  .put('/api/admin/accounts/:id', AccountController.updateAccount)
  .delete('/api/admin/accounts/:id', AccountController.deleteAccount);

export default router;
