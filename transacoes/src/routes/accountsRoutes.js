import express from 'express';
import { local, bearer } from '../middleware/autenticationMiddleware.js';
import AccountController from '../controllers/AccountsController.js';

const router = express.Router();

router
  .get('/api/admin/ping', bearer, AccountController.ping)
  .get('/api/admin/accounts', bearer, AccountController.findAccounts)
  .get('/api/admin/accounts/:id', AccountController.findAccountById)
  .post('/api/admin/accounts', AccountController.createAccount)
  .post('/api/accounts/login', local, AccountController.login)
  .put('/api/admin/accounts/:id', AccountController.updateAccount)
  .delete('/api/admin/accounts/:id', AccountController.deleteAccount);

export default router;
