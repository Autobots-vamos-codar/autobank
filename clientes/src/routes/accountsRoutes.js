import express from 'express';
// import passport from '../middleware/estrategias.js';
import AccountController from '../controllers/AccountsController.js';
// import token from '../middlware/tokenteste.js';
import { bearer, local } from '../middleware/autenticationMiddleware.js';

const router = express.Router();

router
  .get('/api/admin/accounts', bearer, AccountController.findAccounts)
  .get('/api/admin/accounts/:id', AccountController.findAccountById)
  .post('/api/admin/accounts', AccountController.createAccount)
  .post('/api/accounts/login', local, AccountController.login)
  .put('/api/admin/accounts/:id', AccountController.updateAccount)
  .delete('/api/admin/accounts/:id', AccountController.deleteAccount);

export default router;
