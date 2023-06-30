/* eslint-disable import/no-unresolved */
import express from 'express';
import passport from '../middlware/estrategias.js';
import AccountController from '../controllers/AccountsController.js';

const router = express.Router();

router
  .get('/api/admin/accounts', passport.authenticate('bearer', { session: false }), AccountController.findAccounts)
  .get('/api/admin/accounts/:id', AccountController.findAccountById)
  .post('/api/admin/accounts', AccountController.createAccount)
  .post('/api/accounts/login', passport.authenticate('local', { session: false }), AccountController.login)
  .put('/api/admin/accounts/:id', AccountController.updateAccount)
  .delete('/api/admin/accounts/:id', AccountController.deleteAccount);

export default router;
