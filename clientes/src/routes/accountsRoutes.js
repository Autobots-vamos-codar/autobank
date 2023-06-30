/* eslint-disable import/no-unresolved */
import express from 'express';
import AccountController from '../controllers/AccountsController.js';

const router = express.Router();

router
  .get('/api/admin/accounts', AccountController.findAccounts)
  .get('/api/admin/accounts/:id', AccountController.findAccountById)
  .post('/api/admin/accounts', AccountController.createAccount)
  .post('/api/accounts/login', AccountController.login)
  .put('/api/admin/accounts/:id', AccountController.updateAccount)
  .delete('/api/admin/accounts/:id', AccountController.deleteAccount);

export default router;
