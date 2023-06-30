/* eslint-disable import/no-unresolved */
import express from 'express';
// import passport from '../middleware/estrategias.js';
import AccountController from '../controllers/AccountsController.js';
<<<<<<< HEAD
=======
// import token from '../middlware/tokenteste.js';
import { bearer, local } from '../middleware/autenticationMiddleware.js';
>>>>>>> 6a6c873046d02b4d8f82d8c06b196c46a6d6e9b0

const router = express.Router();

router
  .get('/api/admin/accounts', bearer, AccountController.findAccounts)
  .get('/api/admin/accounts/:id', AccountController.findAccountById)
  .post('/api/admin/accounts', AccountController.createAccount)
  .post('/api/accounts/login', local, AccountController.login)
  .put('/api/admin/accounts/:id', AccountController.updateAccount)
  .delete('/api/admin/accounts/:id', AccountController.deleteAccount);

export default router;
