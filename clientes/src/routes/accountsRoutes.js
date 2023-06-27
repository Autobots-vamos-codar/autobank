import express from 'express';
import AccountController from '../controllers/AccountsController.js';

const router = express.Router();

router
  .get('/api/admin/accounts', AccountController.findAccounts)
  .get('/api/admin/accounts/:id', AccountController.findAccountById)
  .get('/api/admin/accounts/user/:id', AccountController.getUserDataWithoutAccount)
  .post('/api/admin/accounts', AccountController.createAccount)
  .post('/api/accounts/login', AccountController.login)
  .put('/api/admin/accounts/:id', AccountController.updateAccount)
  .delete('/api/admin/accounts/:id', AccountController.deleteAccount);

export default router;
